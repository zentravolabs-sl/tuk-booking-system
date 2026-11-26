"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";
import { sendBookingLifecycleEmails } from "@/lib/email";
import {
  customerRegistrationSchema,
  CustomerRegistrationValues,
  customerOtpVerifySchema,
  customerLoginOtpRequestSchema
} from "@/lib/validations";
import {
  initiateCustomerLoginOtp,
  initiateCustomerRegistrationOtp,
  resendCustomerRegistrationOtp,
  verifyCustomerOtpAndCompleteRegistration,
  destroyCustomerSession,
  getCurrentCustomer
} from "@/lib/customer-auth";

export async function sendCustomerLoginOtpAction(email: string) {
  try {
    const hdrs = headers();
    const ip = hdrs.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(`cust-login-otp:${ip}`, 10, 60 * 1000);
    if (!rate.allowed) {
      return {
        success: false,
        error: "Too many OTP requests. Please wait a minute before trying again."
      };
    }

    const parsed = customerLoginOtpRequestSchema.safeParse({ email });
    if (!parsed.success) {
      return {
        success: false,
        error:
          parsed.error.issues[0]?.message ||
          "Please enter a valid email address."
      };
    }

    return await initiateCustomerLoginOtp(parsed.data.email);
  } catch (error) {
    console.error("Customer login OTP error:", error);
    return {
      success: false,
      error: "Unable to send login OTP right now. Please try again."
    };
  }
}

export async function sendCustomerRegistrationOtpAction(
  rawValues: CustomerRegistrationValues
) {
  try {
    const hdrs = headers();
    const ip = hdrs.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(`cust-reg-otp:${ip}`, 8, 60 * 1000);
    if (!rate.allowed) {
      return {
        success: false,
        error: "Too many OTP requests. Please wait a minute before trying again."
      };
    }

    const parsed = customerRegistrationSchema.safeParse(rawValues);
    if (!parsed.success) {
      return {
        success: false,
        error:
          parsed.error.issues[0]?.message ||
          "Please check all required registration fields."
      };
    }

    const data = parsed.data;
    return await initiateCustomerRegistrationOtp({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || "",
      country: data.country || ""
    });
  } catch (error) {
    console.error("Customer registration OTP error:", error);
    return {
      success: false,
      error: "Unable to initiate registration right now. Please try again."
    };
  }
}

export async function resendCustomerRegistrationOtpAction(email: string) {
  try {
    const hdrs = headers();
    const ip = hdrs.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(`cust-resend-otp:${ip}`, 5, 60 * 1000);
    if (!rate.allowed) {
      return {
        success: false,
        error: "Please wait a moment before requesting another OTP code."
      };
    }

    if (!email || !email.includes("@")) {
      return {
        success: false,
        error: "Please provide a valid email address."
      };
    }

    return await resendCustomerRegistrationOtp(email);
  } catch (error) {
    console.error("Resend customer OTP error:", error);
    return {
      success: false,
      error: "Unable to resend OTP right now. Please try again."
    };
  }
}

export async function verifyCustomerRegistrationOtpAction(
  email: string,
  otp: string
) {
  try {
    const hdrs = headers();
    const ip = hdrs.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(`cust-verify-otp:${ip}`, 10, 60 * 1000);
    if (!rate.allowed) {
      return {
        success: false,
        error: "Too many verification attempts. Please wait a minute."
      };
    }

    const parsed = customerOtpVerifySchema.safeParse({ email, otp });
    if (!parsed.success) {
      return {
        success: false,
        error:
          parsed.error.issues[0]?.message ||
          "Please enter a valid 6-digit OTP code."
      };
    }

    const res = await verifyCustomerOtpAndCompleteRegistration(
      parsed.data.email,
      parsed.data.otp
    );

    if (res.success) {
      revalidatePath("/dashboard");
      revalidatePath("/login");
      revalidatePath("/register");
      revalidatePath("/admin/customers");
      revalidatePath("/");
    }

    return res;
  } catch (error) {
    console.error("Customer OTP verification error:", error);
    return {
      success: false,
      error: "Unable to verify OTP right now. Please try again."
    };
  }
}

export async function customerLogoutAction() {
  await destroyCustomerSession();
  revalidatePath("/dashboard");
  revalidatePath("/login");
  revalidatePath("/");
  return { success: true };
}

export async function getCustomerSessionStatusAction() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return { loggedIn: false, customer: null };
    }
    return {
      loggedIn: true,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone:
          customer.phone && customer.phone !== "Not provided"
            ? customer.phone
            : "",
        country:
          customer.country && customer.country !== "International"
            ? customer.country
            : ""
      }
    };
  } catch {
    return { loggedIn: false, customer: null };
  }
}

export async function updateCustomerProfileAction(input: {
  fullName: string;
  phone: string;
  country: string;
}) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return {
        success: false,
        error: "Your session has expired. Please sign in again."
      };
    }

    const cleanName = sanitizeText(input.fullName);
    const cleanPhone = sanitizeText(input.phone) || "Not provided";
    const cleanCountry = sanitizeText(input.country) || "International";

    if (cleanName.length < 2) {
      return {
        success: false,
        error: "Please enter your full name."
      };
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        fullName: cleanName,
        phone: cleanPhone,
        country: cleanCountry
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Update customer profile error:", error);
    return {
      success: false,
      error: "Unable to update profile right now."
    };
  }
}

export async function cancelCustomerBookingAction(bookingId: string) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return {
        success: false,
        error: "Your session has expired. Please sign in again."
      };
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        destination: true,
        tourPackage: true,
        items: true
      }
    });

    if (!booking) {
      return {
        success: false,
        error: "Booking not found."
      };
    }

    const isOwner =
      booking.customerId === customer.id ||
      booking.customerEmail.toLowerCase() === customer.email.toLowerCase();

    if (!isOwner) {
      return {
        success: false,
        error: "You are not authorized to cancel this booking."
      };
    }

    if (booking.status === "CANCELLED") {
      return {
        success: false,
        error: "This booking is already cancelled."
      };
    }

    if (booking.status === "COMPLETED") {
      return {
        success: false,
        error: "Completed bookings cannot be cancelled."
      };
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date()
      }
    });

    const tourTitle =
      booking.tourPackage?.name ||
      booking.destination?.name ||
      booking.customTitle ||
      booking.items?.[0]?.title ||
      "Ella Tuk Tuk Experience";

    await sendBookingLifecycleEmails("BOOKING_CANCELLED", {
      bookingId: updated.id,
      bookingReference: updated.bookingReference,
      customerName: updated.customerName,
      customerEmail: updated.customerEmail,
      customerPhone: updated.customerPhone,
      customerCountry: updated.customerCountry,
      tourTitle,
      bookingDate: new Date(updated.bookingDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      bookingTime: updated.bookingTime,
      pickupLocation: updated.pickupLocation,
      passengers: updated.passengers,
      basePrice: updated.basePrice,
      additionalCharges: updated.additionalCharges,
      itemDiscount: updated.itemDiscount,
      couponDiscount: updated.couponDiscount,
      totalPrice: updated.totalPrice,
      status: updated.status,
      specialRequests: updated.specialRequests
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${bookingId}`);

    return { success: true };
  } catch (error) {
    console.error("Cancel customer booking error:", error);
    return {
      success: false,
      error: "Unable to cancel booking right now. Please try again."
    };
  }
}


