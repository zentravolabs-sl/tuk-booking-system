import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Row,
  Column,
  Link
} from "@react-email/components";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface BookingEmailPayload {
  bookingId: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  tourTitle: string;
  bookingDate: string;
  bookingTime: string;
  pickupLocation: string;
  passengers: number;
  basePrice: number;
  additionalCharges: number;
  itemDiscount: number;
  couponDiscount: number;
  totalPrice: number;
  status: string;
  specialRequests?: string | null;
}

export function BookingNotificationEmail({
  heading,
  bodyIntro,
  footerNote,
  ctaText,
  ctaUrl,
  payload
}: {
  heading: string;
  bodyIntro: string;
  footerNote: string;
  ctaText: string;
  ctaUrl: string;
  payload: BookingEmailPayload;
}) {
  return (
    <Html>
      <Head />
      <Preview>{`${heading} — Booking #${payload.bookingReference}`}</Preview>
      <Body style={{ backgroundColor: "#FFF8ED", fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, padding: "24px 0" }}>
        <Container style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", maxWidth: "600px", margin: "0 auto", overflow: "hidden", border: "1px solid #E5DEC9" }}>
          <Section style={{ backgroundColor: "#0B3024", padding: "28px 32px", textAlign: "center" }}>
            <Text style={{ color: "#E8B44C", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 6px 0", fontWeight: 700 }}>
              KAVITH TUK TUK SERVICE • ELLA, SRI LANKA
            </Text>
            <Heading style={{ color: "#FFFFFF", fontSize: "24px", margin: 0, fontWeight: 700 }}>
              {heading}
            </Heading>
          </Section>

          <Section style={{ padding: "28px 32px" }}>
            <Text style={{ color: "#202820", fontSize: "15px", lineHeight: "24px", margin: "0 0 16px 0" }}>
              Ayubowan <strong>{payload.customerName}</strong>,
            </Text>
            <Text style={{ color: "#3d4a3d", fontSize: "15px", lineHeight: "24px", margin: "0 0 24px 0" }}>
              {bodyIntro}
            </Text>

            <Section style={{ backgroundColor: "#FFF8ED", borderRadius: "12px", padding: "20px", border: "1px solid #E8B44C" }}>
              <Row>
                <Column>
                  <Text style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#5c6b5c", textTransform: "uppercase" }}>Booking Reference</Text>
                  <Text style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: 800, color: "#164B35" }}>{payload.bookingReference}</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#5c6b5c", textTransform: "uppercase" }}>Status</Text>
                  <Text style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 700, color: "#0B3024" }}>{payload.status}</Text>
                </Column>
              </Row>
              <Hr style={{ borderColor: "#E5DEC9", margin: "12px 0" }} />
              <Text style={{ margin: "6px 0", fontSize: "14px", color: "#202820" }}>
                <strong>Experience:</strong> {payload.tourTitle}
              </Text>
              <Text style={{ margin: "6px 0", fontSize: "14px", color: "#202820" }}>
                <strong>Date & Time:</strong> {payload.bookingDate} at {payload.bookingTime}
              </Text>
              <Text style={{ margin: "6px 0", fontSize: "14px", color: "#202820" }}>
                <strong>Pickup Location:</strong> {payload.pickupLocation}
              </Text>
              <Text style={{ margin: "6px 0", fontSize: "14px", color: "#202820" }}>
                <strong>Passengers:</strong> {payload.passengers} Guest(s)
              </Text>
              <Text style={{ margin: "6px 0", fontSize: "14px", color: "#202820" }}>
                <strong>Contact:</strong> {payload.customerPhone} ({payload.customerCountry})
              </Text>
              {payload.specialRequests && (
                <Text style={{ margin: "6px 0", fontSize: "14px", color: "#202820" }}>
                  <strong>Notes:</strong> {payload.specialRequests}
                </Text>
              )}
              <Hr style={{ borderColor: "#E5DEC9", margin: "12px 0" }} />
              <Text style={{ margin: "4px 0", fontSize: "13px", color: "#5c6b5c" }}>
                Base Price: ${payload.basePrice.toFixed(2)}
              </Text>
              {payload.additionalCharges > 0 && (
                <Text style={{ margin: "4px 0", fontSize: "13px", color: "#5c6b5c" }}>
                  Extra Vehicle / Group Adjustment: +${payload.additionalCharges.toFixed(2)}
                </Text>
              )}
              {payload.itemDiscount > 0 && (
                <Text style={{ margin: "4px 0", fontSize: "13px", color: "#164B35" }}>
                  Promotional Discount: -${payload.itemDiscount.toFixed(2)}
                </Text>
              )}
              {payload.couponDiscount > 0 && (
                <Text style={{ margin: "4px 0", fontSize: "13px", color: "#164B35" }}>
                  Coupon Savings: -${payload.couponDiscount.toFixed(2)}
                </Text>
              )}
              <Text style={{ margin: "10px 0 0 0", fontSize: "18px", fontWeight: 800, color: "#0B3024" }}>
                Total Payable: ${payload.totalPrice.toFixed(2)} USD
              </Text>
            </Section>

            <Section style={{ textAlign: "center", marginTop: "24px" }}>
              <Link
                href={ctaUrl}
                style={{
                  backgroundColor: "#E8B44C",
                  color: "#0B3024",
                  padding: "12px 26px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "14px",
                  textDecoration: "none",
                  display: "inline-block"
                }}
              >
                {ctaText}
              </Link>
            </Section>

            <Hr style={{ borderColor: "#E5DEC9", margin: "24px 0" }} />
            <Text style={{ color: "#5c6b5c", fontSize: "13px", lineHeight: "20px", margin: 0 }}>
              {footerNote}
            </Text>
          </Section>

          <Section style={{ backgroundColor: "#164B35", padding: "18px 32px", textAlign: "center" }}>
            <Text style={{ color: "#FFF8ED", fontSize: "12px", margin: 0 }}>
              Kavith Tuk Tuk Service • Main Street, Near Railway Station, Ella 90090, Sri Lanka • Phone / WhatsApp: 0785089432 • Kavithsasalanka@gmail.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function sendBookingLifecycleEmails(
  templateKey: "BOOKING_SUBMITTED" | "BOOKING_CONFIRMED" | "BOOKING_REJECTED" | "BOOKING_CANCELLED" | "BOOKING_COMPLETED",
  payload: BookingEmailPayload
) {
  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { key: templateKey }
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const subject = (template?.subject || `Ella Tuk Tuk Booking (#${payload.bookingReference})`).replace(
      /\{\{bookingReference\}\}/g,
      payload.bookingReference
    );
    const heading = template?.heading || `Booking Update (#${payload.bookingReference})`;
    const bodyIntro = (template?.bodyIntro || "Here are the latest details for your Ella Tuk Tuk adventure.").replace(
      /\{\{bookingReference\}\}/g,
      payload.bookingReference
    );
    const footerNote = template?.footerNote || "Contact us anytime on WhatsApp at +94 77 123 4567.";
    const ctaText = template?.ctaText || "Track Your Booking";
    const trackingUrl = `${appUrl}/track-booking?ref=${encodeURIComponent(payload.bookingReference)}&email=${encodeURIComponent(payload.customerEmail)}`;
    const adminBookingUrl = `${appUrl}/admin/bookings/${payload.bookingId}`;

    if (!resend || !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_demo")) {
      console.log(`📧 [Email Notification Logged - ${templateKey}] To: ${payload.customerEmail} | Ref: ${payload.bookingReference}`);
      return { sent: true, simulated: true };
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "Kavith Tuk Tuk Service <onboarding@resend.dev>";
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

    // 1. Send Customer Email
    let customerSent = false;
    try {
      const customerRes = await resend.emails.send({
        from: fromEmail,
        to: [payload.customerEmail],
        subject,
        react: BookingNotificationEmail({
          heading,
          bodyIntro,
          footerNote,
          ctaText,
          ctaUrl: trackingUrl,
          payload
        })
      });
      customerSent = !customerRes.error;
      if (customerRes.error) {
        console.error("⚠️ Customer booking email error:", customerRes.error);
      }
    } catch (custErr) {
      console.error("⚠️ Customer booking email exception:", custErr);
    }

    // 2. Send Admin Notification Email on new booking submission or cancellation to ADMIN_NOTIFICATION_EMAIL
    let adminSent = false;
    if ((templateKey === "BOOKING_SUBMITTED" || templateKey === "BOOKING_CANCELLED") && adminEmail) {
      try {
        const isCancelled = templateKey === "BOOKING_CANCELLED";
        const adminRes = await resend.emails.send({
          from: fromEmail,
          to: [adminEmail],
          replyTo: payload.customerEmail,
          subject: isCancelled
            ? `[BOOKING CANCELLED] ${payload.bookingReference} — ${payload.customerName} (${payload.tourTitle})`
            : `[NEW BOOKING] ${payload.bookingReference} — ${payload.customerName} ($${payload.totalPrice})`,
          react: BookingNotificationEmail({
            heading: isCancelled
              ? `Booking Cancelled: ${payload.bookingReference}`
              : `New Booking Received: ${payload.bookingReference}`,
            bodyIntro: isCancelled
              ? `The booking for ${payload.tourTitle} on ${payload.bookingDate} at ${payload.bookingTime} has been cancelled by ${payload.customerName} (${payload.customerEmail}).`
              : `A new booking has been submitted by ${payload.customerName} (${payload.customerCountry}). Review and confirm it in the admin dashboard.`,
            footerNote: "Click the button above to open the admin booking details page.",
            ctaText: "Open Admin Booking Details",
            ctaUrl: adminBookingUrl,
            payload
          })
        });
        adminSent = !adminRes.error;
        if (adminRes.error) {
          console.error("⚠️ Admin booking email error:", adminRes.error);
        }
      } catch (admErr) {
        console.error("⚠️ Admin booking email exception:", admErr);
      }
    }

    return { sent: customerSent || adminSent, customerSent, adminSent, simulated: false };
  } catch (error) {
    console.error("⚠️ Non-fatal email delivery error:", error);
    return { sent: false, error: String(error) };
  }
}

export async function sendContactInquiryEmail(inquiry: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}) {
  try {
    if (!resend || !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_demo")) {
      console.log(`📧 [Contact Inquiry Email Logged] From: ${inquiry.email} | Subject: ${inquiry.subject}`);
      return { sent: true, simulated: true };
    }
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Kavith Tuk Tuk Service <onboarding@resend.dev>";
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "Kavithsasalanka@gmail.com";

    await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `[Contact Inquiry] ${inquiry.subject} — ${inquiry.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5dec9;border-radius:12px;">
          <h2 style="color:#164B35;margin-top:0;">New Contact Message from ${inquiry.name}</h2>
          <p><strong>Email:</strong> ${inquiry.email}</p>
          <p><strong>Phone:</strong> ${inquiry.phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${inquiry.subject}</p>
          <hr style="border-color:#e5dec9;" />
          <p style="white-space:pre-line;">${inquiry.message}</p>
        </div>
      `
    });
    return { sent: true };
  } catch (error) {
    console.error("⚠️ Non-fatal contact email error:", error);
    return { sent: false };
  }
}

export async function sendRideBookingAdminEmail(booking: {
  bookingReference: string;
  selectedDestination: string;
  priceUsd?: number;
  priceLkr?: number;
  customerName: string;
  whatsappNumber: string;
  customerEmail: string;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
}) {
  try {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Kavith Tuk Tuk Service <onboarding@resend.dev>";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (
      !resend ||
      !process.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY.startsWith("re_demo")
    ) {
      console.log(
        `📧 [Ride Booking Emails Simulated] Customer: ${booking.customerEmail} | Admin: ${adminEmail} | Ride: ${booking.selectedDestination}`
      );
      return {
        sent: true,
        customerSent: true,
        adminSent: true,
        simulated: true,
        adminEmail
      };
    }

    const priceDisplay =
      booking.priceUsd || booking.priceLkr
        ? `$${Number(booking.priceUsd || 0).toFixed(2)} USD / Rs. ${Number(
            booking.priceLkr || 0
          ).toLocaleString("en-LK")}`
        : "Standard Ride Rate";

    const cleanWhatsapp = booking.whatsappNumber.replace(/[^0-9]/g, "");
    const trackingUrl = `${appUrl}/track-booking?ref=${encodeURIComponent(
      booking.bookingReference
    )}&email=${encodeURIComponent(booking.customerEmail)}`;

    // 1. Send Admin Email to ADMIN_NOTIFICATION_EMAIL in .env
    let adminSent = false;
    if (adminEmail) {
      try {
        const { error: adminError } = await resend.emails.send({
          from: fromEmail,
          to: [adminEmail],
          replyTo: booking.customerEmail,
          subject: `[NEW RIDE BOOKING] ${booking.selectedDestination} — ${booking.customerName} (${booking.pickupDate})`,
          html: `
            <div style="background-color:#FFF8ED;padding:28px 16px;font-family:system-ui,-apple-system,sans-serif;">
              <div style="max-width:600px;margin:0 auto;background-color:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E5DEC9;">
                <div style="background-color:#0B3024;padding:24px 28px;text-align:center;">
                  <p style="color:#E8B44C;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px 0;font-weight:700;">
                    KAVITH TUK TUK SERVICE • ADMIN NOTIFICATION
                  </p>
                  <h1 style="color:#FFFFFF;font-size:22px;margin:0;font-weight:700;">
                    New Ride Booking Received
                  </h1>
                </div>

                <div style="padding:28px;">
                  <p style="color:#202820;font-size:15px;margin:0 0 18px 0;">
                    A new ride booking was placed by <strong>${booking.customerName}</strong>:
                  </p>

                  <div style="background-color:#FFF8ED;border-radius:12px;padding:20px;border:1px solid #E8B44C;">
                    <p style="margin:0 0 8px 0;font-size:13px;color:#5c6b5c;text-transform:uppercase;letter-spacing:1px;">
                      Reference: <strong style="color:#164B35;">${booking.bookingReference}</strong>
                    </p>
                    <hr style="border:none;border-top:1px solid #E5DEC9;margin:12px 0;" />

                    <p style="margin:8px 0;font-size:15px;color:#202820;">
                      <strong>Selected Destination:</strong> ${booking.selectedDestination}
                    </p>
                    <p style="margin:8px 0;font-size:15px;color:#164B35;">
                      <strong>Ride Price:</strong> ${priceDisplay}
                    </p>
                    <p style="margin:8px 0;font-size:15px;color:#202820;">
                      <strong>Customer Name:</strong> ${booking.customerName}
                    </p>
                    <p style="margin:8px 0;font-size:15px;color:#202820;">
                      <strong>WhatsApp Number:</strong> <a href="https://wa.me/${cleanWhatsapp}" style="color:#164B35;font-weight:700;">${booking.whatsappNumber}</a>
                    </p>
                    <p style="margin:8px 0;font-size:15px;color:#202820;">
                      <strong>Email:</strong> <a href="mailto:${booking.customerEmail}" style="color:#164B35;">${booking.customerEmail}</a>
                    </p>
                    <p style="margin:8px 0;font-size:15px;color:#202820;">
                      <strong>Pick-up Date:</strong> ${booking.pickupDate}
                    </p>
                    <p style="margin:8px 0;font-size:15px;color:#202820;">
                      <strong>Pick-up Time:</strong> ${booking.pickupTime}
                    </p>
                    <p style="margin:8px 0;font-size:15px;color:#202820;">
                      <strong>Number of Passengers:</strong> ${booking.passengers}
                    </p>
                  </div>

                  <div style="text-align:center;margin-top:24px;">
                    <a href="https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                      `Ayubowan ${booking.customerName}! Thank you for booking your ride to ${booking.selectedDestination} on ${booking.pickupDate} at ${booking.pickupTime} with Kavith Tuk Tuk Service (Ref: ${booking.bookingReference}).`
                    )}" style="background-color:#164B35;color:#FFFFFF;padding:12px 24px;border-radius:999px;font-weight:700;font-size:14px;text-decoration:none;display:inline-block;margin-right:8px;">
                      Reply on WhatsApp
                    </a>
                    <a href="mailto:${booking.customerEmail}?subject=${encodeURIComponent(
                      `Ride Booking Confirmation: ${booking.selectedDestination} (${booking.bookingReference})`
                    )}" style="background-color:#E8B44C;color:#0B3024;padding:12px 24px;border-radius:999px;font-weight:700;font-size:14px;text-decoration:none;display:inline-block;">
                      Reply via Email
                    </a>
                  </div>
                </div>

                <div style="background-color:#164B35;padding:16px 28px;text-align:center;">
                  <p style="color:#FFF8ED;font-size:12px;margin:0;">
                    Sent to Admin (${adminEmail}) • Kavith Tuk Tuk Service, Ella, Sri Lanka
                  </p>
                </div>
              </div>
            </div>
          `
        });

        adminSent = !adminError;
        if (adminError) {
          console.error("⚠️ Resend admin ride booking email error:", adminError);
        }
      } catch (admErr) {
        console.error("⚠️ Admin ride booking email exception:", admErr);
      }
    }

    // 2. Send Customer Confirmation Email to booking.customerEmail
    let customerSent = false;
    try {
      const { error: customerError } = await resend.emails.send({
        from: fromEmail,
        to: [booking.customerEmail],
        subject: `Your Ella Tuk Tuk Ride Booking (#${booking.bookingReference}) — ${booking.selectedDestination}`,
        html: `
          <div style="background-color:#FFF8ED;padding:28px 16px;font-family:system-ui,-apple-system,sans-serif;">
            <div style="max-width:600px;margin:0 auto;background-color:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E5DEC9;">
              <div style="background-color:#0B3024;padding:24px 28px;text-align:center;">
                <p style="color:#E8B44C;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px 0;font-weight:700;">
                  KAVITH TUK TUK SERVICE • ELLA, SRI LANKA
                </p>
                <h1 style="color:#FFFFFF;font-size:22px;margin:0;font-weight:700;">
                  Ayubowan! Your Ride Request is Received
                </h1>
              </div>

              <div style="padding:28px;">
                <p style="color:#202820;font-size:15px;line-height:24px;margin:0 0 14px 0;">
                  Hello <strong>${booking.customerName}</strong>,
                </p>
                <p style="color:#3d4a3d;font-size:15px;line-height:24px;margin:0 0 20px 0;">
                  Thank you for booking your ride with <strong>Kavith Tuk Tuk Service</strong>! Our local dispatch team has received your booking details and will confirm your driver shortly.
                </p>

                <div style="background-color:#FFF8ED;border-radius:12px;padding:20px;border:1px solid #E8B44C;">
                  <p style="margin:0 0 8px 0;font-size:13px;color:#5c6b5c;text-transform:uppercase;letter-spacing:1px;">
                    Booking Reference: <strong style="color:#164B35;font-size:16px;">${booking.bookingReference}</strong>
                  </p>
                  <hr style="border:none;border-top:1px solid #E5DEC9;margin:12px 0;" />

                  <p style="margin:8px 0;font-size:15px;color:#202820;">
                    <strong>Selected Destination:</strong> ${booking.selectedDestination}
                  </p>
                  <p style="margin:8px 0;font-size:15px;color:#164B35;">
                    <strong>Estimated Fare:</strong> ${priceDisplay}
                  </p>
                  <p style="margin:8px 0;font-size:15px;color:#202820;">
                    <strong>Pick-up Date:</strong> ${booking.pickupDate}
                  </p>
                  <p style="margin:8px 0;font-size:15px;color:#202820;">
                    <strong>Pick-up Time:</strong> ${booking.pickupTime}
                  </p>
                  <p style="margin:8px 0;font-size:15px;color:#202820;">
                    <strong>Number of Passengers:</strong> ${booking.passengers} Guest(s)
                  </p>
                  <p style="margin:8px 0;font-size:15px;color:#202820;">
                    <strong>WhatsApp Contact:</strong> ${booking.whatsappNumber}
                  </p>
                </div>

                <div style="text-align:center;margin-top:24px;">
                  <a href="${trackingUrl}" style="background-color:#E8B44C;color:#0B3024;padding:12px 26px;border-radius:999px;font-weight:700;font-size:14px;text-decoration:none;display:inline-block;">
                    Track Your Booking Online
                  </a>
                </div>

                <hr style="border:none;border-top:1px solid #E5DEC9;margin:24px 0;" />
                <p style="color:#5c6b5c;font-size:13px;line-height:20px;margin:0;">
                  Need to update your pickup time or have questions? Reply directly to this email or message us on WhatsApp at <strong>+94 78 508 9432</strong>.
                </p>
              </div>

              <div style="background-color:#164B35;padding:16px 28px;text-align:center;">
                <p style="color:#FFF8ED;font-size:12px;margin:0;">
                  Kavith Tuk Tuk Service • Main Street, Near Railway Station, Ella 90090, Sri Lanka
                </p>
              </div>
            </div>
          </div>
        `
      });

      customerSent = !customerError;
      if (customerError) {
        console.error("⚠️ Resend customer ride booking email error:", customerError);
      }
    } catch (custErr) {
      console.error("⚠️ Customer ride booking email exception:", custErr);
    }

    return {
      sent: adminSent || customerSent,
      adminSent,
      customerSent,
      simulated: false,
      adminEmail
    };
  } catch (error) {
    console.error("⚠️ Non-fatal ride booking email error:", error);
    return { sent: false, error: String(error) };
  }
}

export async function sendCustomerOtpEmail(payload: {
  email: string;
  fullName: string;
  otpCode: string;
  expiresInMinutes?: number;
}) {
  try {
    const expiresIn = payload.expiresInMinutes || 10;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Kavith Tuk Tuk Service <onboarding@resend.dev>";

    if (
      !resend ||
      !process.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY.startsWith("re_demo")
    ) {
      console.log(
        `📧 [Customer OTP Email Simulated] To: ${payload.email} | OTP Code: ${payload.otpCode}`
      );
      return { sent: true, simulated: true };
    }

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [payload.email],
      subject: `${payload.otpCode} is your Kavith Tuk Tuk login OTP code`,
      html: `
        <div style="background-color:#FFF8ED;padding:28px 16px;font-family:system-ui,-apple-system,sans-serif;">
          <div style="max-width:560px;margin:0 auto;background-color:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E5DEC9;">
            <div style="background-color:#0B3024;padding:24px 28px;text-align:center;">
              <p style="color:#E8B44C;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px 0;font-weight:700;">
                KAVITH TUK TUK SERVICE • ELLA, SRI LANKA
              </p>
              <h1 style="color:#FFFFFF;font-size:22px;margin:0;font-weight:700;">
                Your Login OTP Code
              </h1>
            </div>

            <div style="padding:28px;">
              <p style="color:#202820;font-size:15px;line-height:24px;margin:0 0 12px 0;">
                Ayubowan <strong>${payload.fullName}</strong>,
              </p>
              <p style="color:#3d4a3d;font-size:15px;line-height:24px;margin:0 0 22px 0;">
                Use the 6-digit One-Time Password (OTP) below to sign in to your <strong>Kavith Tuk Tuk Service</strong> customer dashboard:
              </p>

              <div style="background-color:#FFF8ED;border:2px dashed #E8B44C;border-radius:14px;padding:22px;text-align:center;margin:0 0 22px 0;">
                <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;color:#5c6b5c;text-transform:uppercase;letter-spacing:2px;">
                  Your 6-Digit Login OTP
                </p>
                <div style="font-family:monospace;font-size:34px;font-weight:900;letter-spacing:8px;color:#164B35;margin:4px 0;">
                  ${payload.otpCode}
                </div>
                <p style="margin:8px 0 0 0;font-size:12px;color:#5c6b5c;">
                  Valid for ${expiresIn} minutes • Do not share this code with anyone
                </p>
              </div>

              <p style="color:#5c6b5c;font-size:13px;line-height:20px;margin:0;">
                If you did not request this login code, you can safely ignore this email.
              </p>
            </div>

            <div style="background-color:#164B35;padding:16px 28px;text-align:center;">
              <p style="color:#FFF8ED;font-size:12px;margin:0;">
                Kavith Tuk Tuk Service • Main Street, Near Railway Station, Ella 90090, Sri Lanka
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error("⚠️ Resend customer OTP email error:", error);
      return { sent: false, error: error.message || "Email delivery failed" };
    }

    return { sent: true, simulated: false };
  } catch (error) {
    console.error("⚠️ Customer OTP email exception:", error);
    return { sent: false, error: String(error) };
  }
}



