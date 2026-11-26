import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendCustomerOtpEmail } from "@/lib/email";
import { sanitizeText } from "@/lib/utils";

const CUSTOMER_SESSION_COOKIE = "ella_customer_session";
const OTP_PREFIX = "cust_otp:";
const CRED_PREFIX = "cust_cred:";
const SESS_PREFIX = "cust_sess:";

export interface AuthenticatedCustomer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  totalBookings: number;
  totalSpent: number;
  createdAt: Date;
}

interface StoredCustomerCredential {
  customerId: string;
  email: string;
  passwordHash?: string;
  emailVerified: boolean;
  verifiedAt: string;
}

interface StoredPendingOtp {
  email: string;
  fullName: string;
  phone: string;
  country: string;
  otpCode: string;
  attempts: number;
  isRegistration?: boolean;
}

interface StoredCustomerSession {
  customerId: string;
  email: string;
}

export async function initiateCustomerLoginOtp(email: string): Promise<{
  success: boolean;
  error?: string;
  email?: string;
  emailSimulated?: boolean;
}> {
  const normalizedEmail = email.trim().toLowerCase();

  // Check if customer already exists in Customer table (from bookings or previous login/registration)
  const existingCustomer = await prisma.customer.findUnique({
    where: { email: normalizedEmail }
  });

  const defaultNameFromEmail = normalizedEmail
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const fullName = existingCustomer?.fullName || defaultNameFromEmail || "Traveler";
  const phone = existingCustomer?.phone || "Not provided";
  const country = existingCustomer?.country || "International";

  const otpCode = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.verification.deleteMany({
    where: { identifier: `${OTP_PREFIX}${normalizedEmail}` }
  });

  const payload: StoredPendingOtp = {
    email: normalizedEmail,
    fullName,
    phone,
    country,
    otpCode,
    attempts: 0,
    isRegistration: false
  };

  await prisma.verification.create({
    data: {
      identifier: `${OTP_PREFIX}${normalizedEmail}`,
      value: JSON.stringify(payload),
      expiresAt
    }
  });

  const emailRes = await sendCustomerOtpEmail({
    email: normalizedEmail,
    fullName,
    otpCode,
    expiresInMinutes: 10
  });

  if (!emailRes.sent) {
    return {
      success: false,
      error:
        "Could not send the login OTP email right now. Please check your email address and try again."
    };
  }

  return {
    success: true,
    email: normalizedEmail,
    emailSimulated: Boolean(emailRes.simulated)
  };
}

export async function initiateCustomerRegistrationOtp(input: {
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
}): Promise<{
  success: boolean;
  error?: string;
  email?: string;
  emailSimulated?: boolean;
}> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const cleanName = sanitizeText(input.fullName);
  const cleanPhone = sanitizeText(input.phone) || "Not provided";
  const cleanCountry = sanitizeText(input.country) || "International";

  const otpCode = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Remove any older pending OTP records for this email
  await prisma.verification.deleteMany({
    where: { identifier: `${OTP_PREFIX}${normalizedEmail}` }
  });

  const payload: StoredPendingOtp = {
    email: normalizedEmail,
    fullName: cleanName,
    phone: cleanPhone,
    country: cleanCountry,
    otpCode,
    attempts: 0,
    isRegistration: true
  };

  await prisma.verification.create({
    data: {
      identifier: `${OTP_PREFIX}${normalizedEmail}`,
      value: JSON.stringify(payload),
      expiresAt
    }
  });

  const emailRes = await sendCustomerOtpEmail({
    email: normalizedEmail,
    fullName: cleanName,
    otpCode,
    expiresInMinutes: 10
  });

  if (!emailRes.sent) {
    return {
      success: false,
      error:
        "Could not send the verification OTP email right now. Please check your email address and try again."
    };
  }

  return {
    success: true,
    email: normalizedEmail,
    emailSimulated: Boolean(emailRes.simulated)
  };
}

export async function resendCustomerRegistrationOtp(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const normalizedEmail = email.trim().toLowerCase();
  const record = await prisma.verification.findFirst({
    where: { identifier: `${OTP_PREFIX}${normalizedEmail}` },
    orderBy: { createdAt: "desc" }
  });

  if (!record) {
    // Fallback to initiating a new login OTP if no pending record exists
    const fallbackRes = await initiateCustomerLoginOtp(normalizedEmail);
    return {
      success: fallbackRes.success,
      error: fallbackRes.error
    };
  }

  let data: StoredPendingOtp;
  try {
    data = JSON.parse(record.value) as StoredPendingOtp;
  } catch {
    const fallbackRes = await initiateCustomerLoginOtp(normalizedEmail);
    return {
      success: fallbackRes.success,
      error: fallbackRes.error
    };
  }

  const newOtpCode = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  data.otpCode = newOtpCode;
  data.attempts = 0;

  await prisma.verification.update({
    where: { id: record.id },
    data: {
      value: JSON.stringify(data),
      expiresAt
    }
  });

  const emailRes = await sendCustomerOtpEmail({
    email: normalizedEmail,
    fullName: data.fullName,
    otpCode: newOtpCode,
    expiresInMinutes: 10
  });

  if (!emailRes.sent) {
    return {
      success: false,
      error: "Unable to resend OTP email right now. Please try again shortly."
    };
  }

  return { success: true };
}

export async function verifyCustomerOtpAndCompleteRegistration(
  email: string,
  otpInput: string
): Promise<{
  success: boolean;
  error?: string;
  customer?: AuthenticatedCustomer;
}> {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = otpInput.trim();

  const record = await prisma.verification.findFirst({
    where: { identifier: `${OTP_PREFIX}${normalizedEmail}` },
    orderBy: { createdAt: "desc" }
  });

  if (!record || record.expiresAt < new Date()) {
    return {
      success: false,
      error: "Your OTP has expired or is invalid. Please request a new code."
    };
  }

  let pending: StoredPendingOtp;
  try {
    pending = JSON.parse(record.value) as StoredPendingOtp;
  } catch {
    return {
      success: false,
      error: "Unable to verify OTP. Please request a new code."
    };
  }

  if (pending.attempts >= 5) {
    await prisma.verification.delete({ where: { id: record.id } }).catch(() => {});
    return {
      success: false,
      error: "Too many incorrect OTP attempts. Please request a new OTP code."
    };
  }

  if (pending.otpCode !== cleanOtp) {
    pending.attempts += 1;
    await prisma.verification.update({
      where: { id: record.id },
      data: { value: JSON.stringify(pending) }
    });
    return {
      success: false,
      error: "Incorrect OTP code. Please check the 6-digit code sent to your email."
    };
  }

  // OTP verified! Upsert Customer record (preserving any past bookings made with this email)
  const customer = await prisma.customer.upsert({
    where: { email: normalizedEmail },
    update: {
      fullName: pending.isRegistration ? pending.fullName : undefined,
      phone:
        pending.isRegistration && pending.phone !== "Not provided"
          ? pending.phone
          : undefined,
      country:
        pending.isRegistration && pending.country !== "International"
          ? pending.country
          : undefined
    },
    create: {
      fullName: pending.fullName,
      email: normalizedEmail,
      phone: pending.phone,
      country: pending.country
    }
  });

  // Save permanent verified record in Verification table
  await prisma.verification.deleteMany({
    where: { identifier: `${CRED_PREFIX}${normalizedEmail}` }
  });

  const credPayload: StoredCustomerCredential = {
    customerId: customer.id,
    email: normalizedEmail,
    emailVerified: true,
    verifiedAt: new Date().toISOString()
  };

  await prisma.verification.create({
    data: {
      identifier: `${CRED_PREFIX}${normalizedEmail}`,
      value: JSON.stringify(credPayload),
      expiresAt: new Date("2099-12-31T23:59:59.000Z")
    }
  });

  // Clean up OTP record
  await prisma.verification.deleteMany({
    where: { identifier: `${OTP_PREFIX}${normalizedEmail}` }
  });

  // Create customer login session immediately
  await setCustomerSessionCookie(customer.id, customer.email);

  return {
    success: true,
    customer
  };
}

async function setCustomerSessionCookie(customerId: string, email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

  const sessPayload: StoredCustomerSession = {
    customerId,
    email
  };

  await prisma.verification.create({
    data: {
      identifier: `${SESS_PREFIX}${token}`,
      value: JSON.stringify(sessPayload),
      expiresAt
    }
  });

  cookies().set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });
}

export async function getCurrentCustomer(): Promise<AuthenticatedCustomer | null> {
  const token = cookies().get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const sessRecord = await prisma.verification.findFirst({
    where: { identifier: `${SESS_PREFIX}${token}` }
  });

  if (!sessRecord || sessRecord.expiresAt < new Date()) {
    return null;
  }

  try {
    const sess = JSON.parse(sessRecord.value) as StoredCustomerSession;
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [{ id: sess.customerId }, { email: sess.email }]
      }
    });
    return customer || null;
  } catch {
    return null;
  }
}

export async function destroyCustomerSession() {
  const token = cookies().get(CUSTOMER_SESSION_COOKIE)?.value;
  if (token) {
    await prisma.verification
      .deleteMany({ where: { identifier: `${SESS_PREFIX}${token}` } })
      .catch(() => {});
  }
  cookies().delete(CUSTOMER_SESSION_COOKIE);
}

