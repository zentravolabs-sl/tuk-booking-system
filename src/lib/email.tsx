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
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "Kavithsasalanka@gmail.com";

    // Send Customer Email
    await resend.emails.send({
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

    // Send Admin Notification Email on new booking submission
    if (templateKey === "BOOKING_SUBMITTED") {
      await resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        subject: `[NEW BOOKING] ${payload.bookingReference} — ${payload.customerName} ($${payload.totalPrice})`,
        react: BookingNotificationEmail({
          heading: `New Booking Received: ${payload.bookingReference}`,
          bodyIntro: `A new booking has been submitted by ${payload.customerName} (${payload.customerCountry}). Review and confirm it in the admin dashboard.`,
          footerNote: "Click the button above to open the admin booking details page.",
          ctaText: "Open Admin Booking Details",
          ctaUrl: adminBookingUrl,
          payload
        })
      });
    }

    return { sent: true, simulated: false };
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

