"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { calculateServerBookingPrice } from "@/lib/pricing";
import {
  bookingFormSchema,
  BookingFormValues,
  contactFormSchema,
  reviewSubmissionSchema
} from "@/lib/validations";
import { generateBookingReference, sanitizeText } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendBookingLifecycleEmails, sendContactInquiryEmail } from "@/lib/email";
import { BookingType, ReviewStatus } from "@prisma/client";

export async function previewBookingPriceAction(input: {
  bookingType: BookingType;
  destinationId?: string | null;
  tourPackageId?: string | null;
  passengers: number;
  couponCode?: string | null;
  customerEmail?: string | null;
}) {
  return calculateServerBookingPrice(input);
}

export async function submitBookingAction(rawValues: BookingFormValues) {
  try {
    const hdrs = headers();
    const ip = hdrs.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(`booking:${ip}`, 10, 60 * 1000);
    if (!rate.allowed) {
      return {
        success: false,
        error: "Too many booking attempts. Please wait a minute before trying again."
      };
    }

    const parsed = bookingFormSchema.safeParse(rawValues);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Please check all required booking fields."
      };
    }

    const data = parsed.data;
    const customerEmail = data.customerEmail.trim().toLowerCase();

    // Always calculate pricing on the server using live database values
    const pricing = await calculateServerBookingPrice({
      bookingType: data.bookingType,
      destinationId: data.destinationId || null,
      tourPackageId: data.tourPackageId || null,
      passengers: data.passengers,
      couponCode: data.couponCode || null,
      customerEmail
    });

    if (data.couponCode && data.couponCode.trim() !== "" && !pricing.couponValid) {
      return {
        success: false,
        error: pricing.couponMessage || "Invalid coupon code."
      };
    }

    // Generate unique booking reference ELLA-YYYY-XXXXXX
    let bookingReference = generateBookingReference();
    const existingRef = await prisma.booking.findUnique({ where: { bookingReference } });
    if (existingRef) {
      bookingReference = generateBookingReference();
    }

    // Upsert Customer record
    const customer = await prisma.customer.upsert({
      where: { email: customerEmail },
      update: {
        fullName: sanitizeText(data.customerName),
        phone: sanitizeText(data.customerPhone),
        country: sanitizeText(data.customerCountry),
        totalBookings: { increment: 1 },
        totalSpent: { increment: pricing.totalPrice }
      },
      create: {
        fullName: sanitizeText(data.customerName),
        email: customerEmail,
        phone: sanitizeText(data.customerPhone),
        country: sanitizeText(data.customerCountry),
        totalBookings: 1,
        totalSpent: pricing.totalPrice
      }
    });

    // Save Booking in transaction
    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        bookingType: data.bookingType,
        customerId: customer.id,
        destinationId: data.bookingType === "DESTINATION_RIDE" ? data.destinationId || null : null,
        tourPackageId: data.bookingType === "TOUR_PACKAGE" ? data.tourPackageId || null : null,
        customTitle: sanitizeText(data.customTitle) || pricing.itemTitle,
        customerName: sanitizeText(data.customerName),
        customerEmail,
        customerPhone: sanitizeText(data.customerPhone),
        customerCountry: sanitizeText(data.customerCountry),
        passengers: data.passengers,
        bookingDate: new Date(data.bookingDate),
        bookingTime: sanitizeText(data.bookingTime),
        pickupLocation: sanitizeText(data.pickupLocation),
        dropoffLocation: sanitizeText(data.dropoffLocation),
        hotelName: sanitizeText(data.hotelName),
        specialRequests: sanitizeText(data.specialRequests),
        currency: pricing.currency,
        basePrice: pricing.basePrice,
        additionalCharges: pricing.additionalCharges,
        itemDiscount: pricing.itemDiscount,
        couponId: pricing.couponId,
        couponCode: pricing.couponCode,
        couponDiscount: pricing.couponDiscount,
        totalPrice: pricing.totalPrice,
        items: {
          create: [
            {
              itemType: data.bookingType,
              title: pricing.itemTitle,
              destinationId: data.bookingType === "DESTINATION_RIDE" ? data.destinationId || null : null,
              tourPackageId: data.bookingType === "TOUR_PACKAGE" ? data.tourPackageId || null : null,
              quantity: pricing.tukTuksRequired,
              unitPrice: pricing.basePrice,
              discount: pricing.itemDiscount,
              totalPrice: pricing.totalPrice
            }
          ]
        }
      }
    });

    // Record coupon usage if applied
    if (pricing.couponValid && pricing.couponId) {
      await prisma.couponUsage.create({
        data: {
          couponId: pricing.couponId,
          bookingId: booking.id,
          customerEmail,
          discountAmount: pricing.couponDiscount
        }
      });
      await prisma.coupon.update({
        where: { id: pricing.couponId },
        data: { usedCount: { increment: 1 } }
      });
    }

    // Trigger non-blocking email notifications (never fails booking submission)
    await sendBookingLifecycleEmails("BOOKING_SUBMITTED", {
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      customerCountry: booking.customerCountry,
      tourTitle: pricing.itemTitle,
      bookingDate: new Date(data.bookingDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      bookingTime: booking.bookingTime,
      pickupLocation: booking.pickupLocation,
      passengers: booking.passengers,
      basePrice: booking.basePrice,
      additionalCharges: booking.additionalCharges,
      itemDiscount: booking.itemDiscount,
      couponDiscount: booking.couponDiscount,
      totalPrice: booking.totalPrice,
      status: booking.status,
      specialRequests: booking.specialRequests
    });

    revalidatePath("/admin");
    revalidatePath("/admin/bookings");

    return {
      success: true,
      bookingReference: booking.bookingReference,
      bookingId: booking.id,
      customerEmail: booking.customerEmail,
      pricing
    };
  } catch (error) {
    console.error("Booking submission error:", error);
    return {
      success: false,
      error: "Unable to complete booking right now. Please try again or contact us via WhatsApp."
    };
  }
}

export async function trackCustomerBookingAction(reference: string, email: string) {
  const hdrs = headers();
  const ip = hdrs.get("x-forwarded-for") || "127.0.0.1";
  const rate = checkRateLimit(`track:${ip}`, 15, 60 * 1000);
  if (!rate.allowed) {
    return { success: false, error: "Too many lookup requests. Please wait a moment." };
  }

  const cleanRef = reference.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanRef || !cleanEmail) {
    return { success: false, error: "Please enter both your booking reference and email address." };
  }

  const booking = await prisma.booking.findFirst({
    where: {
      bookingReference: cleanRef,
      customerEmail: {
        equals: cleanEmail,
        mode: "insensitive"
      }
    },
    include: {
      destination: {
        select: { name: true, slug: true, coverImage: true, distance: true, travelTime: true }
      },
      tourPackage: {
        select: { name: true, slug: true, coverImage: true, duration: true }
      },
      items: true
    }
  });

  if (!booking) {
    return {
      success: false,
      error: "No booking matched that reference and email address. Please verify both fields."
    };
  }

  return {
    success: true,
    booking
  };
}

export async function submitContactMessageAction(rawValues: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const hdrs = headers();
  const ip = hdrs.get("x-forwarded-for") || "127.0.0.1";
  const rate = checkRateLimit(`contact:${ip}`, 6, 60 * 1000);
  if (!rate.allowed) {
    return { success: false, error: "You have sent several messages recently. Please wait a minute." };
  }

  const parsed = contactFormSchema.safeParse(rawValues);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Please fill out all required fields."
    };
  }

  const data = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: sanitizeText(data.name),
      email: data.email.trim().toLowerCase(),
      phone: sanitizeText(data.phone),
      subject: sanitizeText(data.subject),
      message: sanitizeText(data.message),
      ipAddress: ip
    }
  });

  await sendContactInquiryEmail({
    name: sanitizeText(data.name),
    email: data.email.trim().toLowerCase(),
    phone: sanitizeText(data.phone),
    subject: sanitizeText(data.subject),
    message: sanitizeText(data.message)
  });

  revalidatePath("/admin/messages");
  return { success: true };
}

export async function submitCustomerReviewAction(rawValues: {
  customerName: string;
  customerEmail?: string;
  country: string;
  rating: number;
  title: string;
  comment: string;
  bookingReference?: string;
  tourTitle?: string;
  destinationId?: string;
  tourPackageId?: string;
}) {
  const hdrs = headers();
  const ip = hdrs.get("x-forwarded-for") || "127.0.0.1";
  const rate = checkRateLimit(`review:${ip}`, 5, 60 * 1000);
  if (!rate.allowed) {
    return { success: false, error: "Too many review submissions. Please wait a moment." };
  }

  const parsed = reviewSubmissionSchema.safeParse(rawValues);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Please complete all required review fields."
    };
  }

  const d = parsed.data;
  await prisma.customerReview.create({
    data: {
      customerName: sanitizeText(d.customerName),
      customerEmail: d.customerEmail ? d.customerEmail.trim().toLowerCase() : null,
      country: sanitizeText(d.country),
      rating: d.rating,
      title: sanitizeText(d.title),
      comment: sanitizeText(d.comment),
      bookingReference: sanitizeText(d.bookingReference),
      tourTitle: sanitizeText(d.tourTitle),
      destinationId: d.destinationId || null,
      tourPackageId: d.tourPackageId || null,
      status: ReviewStatus.PENDING,
      travelDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
  });

  revalidatePath("/admin/reviews");
  return { success: true };
}

