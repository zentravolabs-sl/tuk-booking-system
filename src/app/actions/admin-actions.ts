"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
  logAdminAction
} from "@/lib/auth";
import {
  destinationFormSchema,
  tourPackageFormSchema,
  offerFormSchema,
  couponFormSchema
} from "@/lib/validations";
import { calculateFinalPrice, sanitizeText, slugify } from "@/lib/utils";
import { sendBookingLifecycleEmails } from "@/lib/email";
import { AdminRole, BookingStatus, ReviewStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

// 1. Admin Auth
export async function adminLoginAction(email: string, password: string) {
  return createAdminSession(email, password);
}

export async function adminLogoutAction() {
  await destroyAdminSession();
  revalidatePath("/admin");
  return { success: true };
}

// 2. Booking Management
export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus,
  adminNotes?: string,
  driverAssigned?: string,
  vehicleNumber?: string
) {
  const admin = await requireAdmin();

  const existing = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { destination: true, tourPackage: true }
  });

  if (!existing) {
    return { success: false, error: "Booking not found." };
  }

  const now = new Date();
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status,
      adminNotes: adminNotes !== undefined ? sanitizeText(adminNotes) : existing.adminNotes,
      driverAssigned: driverAssigned !== undefined ? sanitizeText(driverAssigned) : existing.driverAssigned,
      vehicleNumber: vehicleNumber !== undefined ? sanitizeText(vehicleNumber) : existing.vehicleNumber,
      confirmedAt: status === "CONFIRMED" ? now : existing.confirmedAt,
      completedAt: status === "COMPLETED" ? now : existing.completedAt,
      cancelledAt: status === "CANCELLED" ? now : existing.cancelledAt,
      rejectedAt: status === "REJECTED" ? now : existing.rejectedAt
    }
  });

  await logAdminAction(
    admin,
    `BOOKING_${status}`,
    "Booking",
    bookingId,
    `Updated booking ${existing.bookingReference} to ${status}`
  );

  const templateMap: Partial<Record<BookingStatus, "BOOKING_CONFIRMED" | "BOOKING_REJECTED" | "BOOKING_CANCELLED" | "BOOKING_COMPLETED">> = {
    CONFIRMED: "BOOKING_CONFIRMED",
    REJECTED: "BOOKING_REJECTED",
    CANCELLED: "BOOKING_CANCELLED",
    COMPLETED: "BOOKING_COMPLETED"
  };

  const templateKey = templateMap[status];
  if (templateKey) {
    const tourTitle =
      existing.destination?.name ||
      existing.tourPackage?.name ||
      existing.customTitle ||
      "Ella Tuk Tuk Experience";

    await sendBookingLifecycleEmails(templateKey, {
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
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  return { success: true };
}

// 3. Destination CRUD
export async function saveDestinationAction(rawInput: unknown) {
  const admin = await requireAdmin();
  const parsed = destinationFormSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid destination data."
    };
  }

  const d = parsed.data;
  const cleanSlug = slugify(d.slug || d.name);
  const finalPrice = calculateFinalPrice(d.price, d.discountType, d.discountValue);

  const includedServices = (d.includedServicesText || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const highlights = (d.highlightsText || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const galleryList = (d.galleryUrls || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const payload = {
    name: sanitizeText(d.name),
    slug: cleanSlug,
    shortDescription: sanitizeText(d.shortDescription),
    description: d.description.trim(),
    categoryId: d.categoryId,
    coverImage: d.coverImage.trim(),
    price: d.price,
    currency: d.currency || "USD",
    priceType: d.priceType,
    discountType: d.discountType,
    discountValue: d.discountValue,
    finalPrice,
    distance: sanitizeText(d.distance),
    travelTime: sanitizeText(d.travelTime),
    entranceFee: sanitizeText(d.entranceFee),
    location: sanitizeText(d.location),
    googleMapsUrl: d.googleMapsUrl || null,
    includedServices: includedServices.length > 0 ? includedServices : ["Hotel Pickup & Drop-off", "Experienced English-Speaking Driver"],
    highlights,
    bestTimeToVisit: sanitizeText(d.bestTimeToVisit) || "6:00 AM - 5:00 PM",
    popular: d.popular,
    featured: d.featured,
    active: d.active,
    seoTitle: sanitizeText(d.seoTitle) || `${d.name} Tuk Tuk Tour | Ella Tuk Tuk Taxi Service`,
    seoDescription: sanitizeText(d.seoDescription) || sanitizeText(d.shortDescription)
  };

  let savedId = d.id;
  if (d.id) {
    await prisma.destination.update({
      where: { id: d.id },
      data: payload
    });
    await prisma.destinationImage.deleteMany({ where: { destinationId: d.id } });
  } else {
    const created = await prisma.destination.create({
      data: payload
    });
    savedId = created.id;
  }

  if (savedId && galleryList.length > 0) {
    for (let i = 0; i < galleryList.length; i++) {
      await prisma.destinationImage.create({
        data: {
          destinationId: savedId,
          url: galleryList[i],
          altText: `${d.name} gallery photo ${i + 1}`,
          sortOrder: i + 1
        }
      });
    }
  }

  await logAdminAction(
    admin,
    d.id ? "UPDATE_DESTINATION" : "CREATE_DESTINATION",
    "Destination",
    savedId,
    `${d.id ? "Updated" : "Created"} destination ${d.name} ($${finalPrice})`
  );

  revalidatePath("/");
  revalidatePath("/destinations");
  revalidatePath(`/destinations/${cleanSlug}`);
  revalidatePath("/admin/destinations");
  return { success: true, id: savedId };
}

export async function toggleDestinationFlagsAction(
  id: string,
  field: "active" | "popular" | "featured",
  value: boolean
) {
  const admin = await requireAdmin();
  const updated = await prisma.destination.update({
    where: { id },
    data: { [field]: value }
  });
  await logAdminAction(admin, "TOGGLE_DESTINATION", "Destination", id, `Set ${field}=${value} on ${updated.name}`);
  revalidatePath("/");
  revalidatePath("/destinations");
  revalidatePath("/admin/destinations");
  return { success: true };
}

export async function deleteDestinationAction(id: string) {
  const admin = await requireAdmin([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);
  const dest = await prisma.destination.delete({ where: { id } });
  await logAdminAction(admin, "DELETE_DESTINATION", "Destination", id, `Deleted destination ${dest.name}`);
  revalidatePath("/");
  revalidatePath("/destinations");
  revalidatePath("/admin/destinations");
  return { success: true };
}

export async function saveDestinationCategoryAction(input: {
  id?: string;
  name: string;
  description?: string;
}) {
  const admin = await requireAdmin();
  const slug = slugify(input.name);
  if (input.id) {
    await prisma.destinationCategory.update({
      where: { id: input.id },
      data: { name: sanitizeText(input.name), slug, description: sanitizeText(input.description) }
    });
  } else {
    await prisma.destinationCategory.create({
      data: { name: sanitizeText(input.name), slug, description: sanitizeText(input.description) }
    });
  }
  await logAdminAction(admin, "SAVE_CATEGORY", "DestinationCategory", slug, `Saved category ${input.name}`);
  revalidatePath("/destinations");
  revalidatePath("/admin/destinations");
  return { success: true };
}

// 4. Tour Package CRUD
export async function saveTourPackageAction(rawInput: unknown) {
  const admin = await requireAdmin();
  const parsed = tourPackageFormSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid tour package fields."
    };
  }

  const d = parsed.data;
  const cleanSlug = slugify(d.slug || d.name);
  const finalPrice = calculateFinalPrice(d.price, d.discountType, d.discountValue);

  const inclusions = (d.inclusionsText || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const exclusions = (d.exclusionsText || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const gallery = (d.galleryUrls || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  let itinerary: Array<{ time: string; title: string; description: string }> = [];
  if (d.itineraryJson) {
    try {
      itinerary = JSON.parse(d.itineraryJson);
    } catch {
      itinerary = d.itineraryJson
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, idx) => {
          const [timePart, ...rest] = line.split("|");
          return {
            time: (timePart || `Stop ${idx + 1}`).trim(),
            title: (rest[0] || line).trim(),
            description: (rest[1] || "Guided highland experience with photo stops.").trim()
          };
        });
    }
  }

  const payload = {
    name: sanitizeText(d.name),
    slug: cleanSlug,
    tagline: sanitizeText(d.tagline),
    shortDescription: sanitizeText(d.shortDescription),
    description: d.description.trim(),
    coverImage: d.coverImage.trim(),
    gallery,
    duration: sanitizeText(d.duration),
    startTime: sanitizeText(d.startTime),
    endTime: sanitizeText(d.endTime),
    minPassengers: d.minPassengers,
    maxPassengers: d.maxPassengers,
    price: d.price,
    currency: d.currency || "USD",
    discountType: d.discountType,
    discountValue: d.discountValue,
    finalPrice,
    itinerary,
    inclusions,
    exclusions,
    terms: d.terms || null,
    popular: d.popular,
    featured: d.featured,
    active: d.active,
    seoTitle: sanitizeText(d.seoTitle) || `${d.name} | Ella Tuk Tuk Tour Package`,
    seoDescription: sanitizeText(d.seoDescription) || sanitizeText(d.shortDescription)
  };

  let savedId = d.id;
  if (d.id) {
    await prisma.tourPackage.update({
      where: { id: d.id },
      data: payload
    });
    await prisma.tourPackageDestination.deleteMany({ where: { tourPackageId: d.id } });
  } else {
    const created = await prisma.tourPackage.create({ data: payload });
    savedId = created.id;
  }

  if (savedId && d.destinationIds.length > 0) {
    for (let i = 0; i < d.destinationIds.length; i++) {
      await prisma.tourPackageDestination.create({
        data: {
          tourPackageId: savedId,
          destinationId: d.destinationIds[i],
          stopOrder: i + 1
        }
      });
    }
  }

  await logAdminAction(
    admin,
    d.id ? "UPDATE_PACKAGE" : "CREATE_PACKAGE",
    "TourPackage",
    savedId,
    `${d.id ? "Updated" : "Created"} tour package ${d.name} ($${finalPrice})`
  );

  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath(`/tours/${cleanSlug}`);
  revalidatePath("/admin/tours");
  return { success: true, id: savedId };
}

export async function deleteTourPackageAction(id: string) {
  const admin = await requireAdmin([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);
  const pkg = await prisma.tourPackage.delete({ where: { id } });
  await logAdminAction(admin, "DELETE_PACKAGE", "TourPackage", id, `Deleted tour package ${pkg.name}`);
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/admin/tours");
  return { success: true };
}

// 5. Offers & Coupons CRUD
export async function saveOfferAction(rawInput: unknown) {
  const admin = await requireAdmin();
  const parsed = offerFormSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid offer fields."
    };
  }

  const d = parsed.data;
  const cleanSlug = slugify(d.slug || d.title);
  const payload = {
    title: sanitizeText(d.title),
    slug: cleanSlug,
    description: sanitizeText(d.description),
    badgeText: sanitizeText(d.badgeText) || "SPECIAL OFFER",
    image: d.image.trim(),
    offerType: d.offerType,
    discountType: d.discountType,
    discountValue: d.discountValue,
    couponCode: d.couponCode ? d.couponCode.trim().toUpperCase() : null,
    startDate: new Date(d.startDate),
    endDate: new Date(d.endDate),
    minBookingAmount: d.minBookingAmount,
    maxDiscount: d.maxDiscount || null,
    usageLimit: d.usageLimit || null,
    perCustomerLimit: d.perCustomerLimit,
    featured: d.featured,
    active: d.active
  };

  if (d.id) {
    await prisma.offer.update({ where: { id: d.id }, data: payload });
  } else {
    await prisma.offer.create({ data: payload });
  }

  await logAdminAction(admin, "SAVE_OFFER", "Offer", cleanSlug, `Saved offer ${d.title}`);
  revalidatePath("/");
  revalidatePath("/offers");
  revalidatePath("/admin/offers");
  return { success: true };
}

export async function deleteOfferAction(id: string) {
  const admin = await requireAdmin([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);
  await prisma.offer.delete({ where: { id } });
  await logAdminAction(admin, "DELETE_OFFER", "Offer", id, "Deleted offer");
  revalidatePath("/");
  revalidatePath("/offers");
  revalidatePath("/admin/offers");
  return { success: true };
}

export async function saveCouponAction(rawInput: unknown) {
  const admin = await requireAdmin();
  const parsed = couponFormSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid coupon fields."
    };
  }

  const d = parsed.data;
  const payload = {
    code: d.code.trim().toUpperCase(),
    title: sanitizeText(d.title),
    description: sanitizeText(d.description),
    discountType: d.discountType,
    discountValue: d.discountValue,
    minBookingAmount: d.minBookingAmount,
    maxDiscount: d.maxDiscount || null,
    startDate: new Date(d.startDate),
    endDate: new Date(d.endDate),
    usageLimit: d.usageLimit || null,
    perCustomerLimit: d.perCustomerLimit,
    firstBookingOnly: d.firstBookingOnly,
    active: d.active
  };

  if (d.id) {
    await prisma.coupon.update({ where: { id: d.id }, data: payload });
  } else {
    await prisma.coupon.create({ data: payload });
  }

  await logAdminAction(admin, "SAVE_COUPON", "Coupon", payload.code, `Saved coupon ${payload.code}`);
  revalidatePath("/offers");
  revalidatePath("/admin/offers");
  return { success: true };
}

export async function deleteCouponAction(id: string) {
  const admin = await requireAdmin([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);
  await prisma.coupon.delete({ where: { id } });
  await logAdminAction(admin, "DELETE_COUPON", "Coupon", id, "Deleted coupon");
  revalidatePath("/offers");
  revalidatePath("/admin/offers");
  return { success: true };
}

// 6. Gallery Management
export async function saveGalleryItemAction(input: {
  id?: string;
  title: string;
  description?: string;
  url: string;
  mediaType?: string;
  categoryId: string;
  location?: string;
  featured: boolean;
  visible: boolean;
  sortOrder?: number;
}) {
  const admin = await requireAdmin();
  const payload = {
    title: sanitizeText(input.title),
    description: sanitizeText(input.description),
    url: input.url.trim(),
    mediaType: input.mediaType || "IMAGE",
    categoryId: input.categoryId,
    location: sanitizeText(input.location) || "Ella, Sri Lanka",
    featured: input.featured,
    visible: input.visible,
    sortOrder: Number(input.sortOrder) || 0
  };

  if (input.id) {
    await prisma.galleryImage.update({ where: { id: input.id }, data: payload });
  } else {
    await prisma.galleryImage.create({ data: payload });
  }

  await logAdminAction(admin, "SAVE_GALLERY_IMAGE", "GalleryImage", input.title, `Saved gallery image ${input.title}`);
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function deleteGalleryItemAction(id: string) {
  const admin = await requireAdmin();
  await prisma.galleryImage.delete({ where: { id } });
  await logAdminAction(admin, "DELETE_GALLERY_IMAGE", "GalleryImage", id, "Deleted gallery item");
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: true };
}

// 7. Reviews Management
export async function updateReviewAction(
  id: string,
  status: ReviewStatus,
  featured: boolean
) {
  const admin = await requireAdmin();
  await prisma.customerReview.update({
    where: { id },
    data: { status, featured }
  });
  await logAdminAction(admin, `REVIEW_${status}`, "CustomerReview", id, `Review status=${status}, featured=${featured}`);
  revalidatePath("/");
  revalidatePath("/destinations");
  revalidatePath("/tours");
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function deleteReviewAction(id: string) {
  const admin = await requireAdmin([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);
  await prisma.customerReview.delete({ where: { id } });
  await logAdminAction(admin, "DELETE_REVIEW", "CustomerReview", id, "Deleted customer review");
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { success: true };
}

// 8. Contact Messages Management
export async function updateContactMessageStatusAction(
  id: string,
  status: string,
  adminReply?: string
) {
  const admin = await requireAdmin();
  await prisma.contactMessage.update({
    where: { id },
    data: {
      status,
      adminReply: adminReply ? sanitizeText(adminReply) : undefined,
      repliedAt: adminReply ? new Date() : undefined
    }
  });
  await logAdminAction(admin, "UPDATE_CONTACT_MESSAGE", "ContactMessage", id, `Set message status to ${status}`);
  revalidatePath("/admin/messages");
  return { success: true };
}

// 9. Website Content & Settings CMS
export async function updateSiteSettingsAction(input: {
  businessName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBackgroundImage: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  currency: string;
  exchangeRateLkr: number;
  airportTransferRate: number;
  hotelPickupRate: number;
  trainPickupRate: number;
  customTourHourly: number;
  facebookUrl?: string;
  instagramUrl?: string;
  tripadvisorUrl?: string;
  aboutHeadline: string;
  aboutStory: string;
  aboutMission: string;
  aboutImage: string;
  faqsJson: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}) {
  const admin = await requireAdmin();
  let faqs = [];
  try {
    faqs = JSON.parse(input.faqsJson);
  } catch {
    faqs = [];
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      businessName: sanitizeText(input.businessName),
      tagline: sanitizeText(input.tagline),
      heroHeadline: sanitizeText(input.heroHeadline),
      heroSubheadline: sanitizeText(input.heroSubheadline),
      heroBackgroundImage: input.heroBackgroundImage.trim(),
      phone: sanitizeText(input.phone),
      whatsapp: sanitizeText(input.whatsapp),
      email: sanitizeText(input.email),
      address: sanitizeText(input.address),
      currency: sanitizeText(input.currency) || "USD",
      exchangeRateLkr: Number(input.exchangeRateLkr) || 305,
      airportTransferRate: Number(input.airportTransferRate) || 95,
      hotelPickupRate: Number(input.hotelPickupRate) || 8,
      trainPickupRate: Number(input.trainPickupRate) || 5,
      customTourHourly: Number(input.customTourHourly) || 12,
      facebookUrl: input.facebookUrl || null,
      instagramUrl: input.instagramUrl || null,
      tripadvisorUrl: input.tripadvisorUrl || null,
      aboutHeadline: sanitizeText(input.aboutHeadline),
      aboutStory: input.aboutStory.trim(),
      aboutMission: input.aboutMission.trim(),
      aboutImage: input.aboutImage.trim(),
      faqs,
      seoTitle: sanitizeText(input.seoTitle),
      seoDescription: sanitizeText(input.seoDescription),
      seoKeywords: sanitizeText(input.seoKeywords)
    },
    create: {
      id: "default",
      businessName: sanitizeText(input.businessName),
      tagline: sanitizeText(input.tagline),
      heroHeadline: sanitizeText(input.heroHeadline),
      heroSubheadline: sanitizeText(input.heroSubheadline),
      heroBackgroundImage: input.heroBackgroundImage.trim(),
      phone: sanitizeText(input.phone),
      whatsapp: sanitizeText(input.whatsapp),
      email: sanitizeText(input.email),
      address: sanitizeText(input.address),
      aboutHeadline: sanitizeText(input.aboutHeadline),
      aboutStory: input.aboutStory.trim(),
      aboutMission: input.aboutMission.trim(),
      aboutImage: input.aboutImage.trim(),
      faqs,
      seoTitle: sanitizeText(input.seoTitle),
      seoDescription: sanitizeText(input.seoDescription),
      seoKeywords: sanitizeText(input.seoKeywords)
    }
  });

  await logAdminAction(admin, "UPDATE_SITE_SETTINGS", "SiteSettings", "default", "Updated CMS content & pricing settings");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/content");
  revalidatePath("/admin/settings");
  return { success: true };
}

// 10. Email Templates Management
export async function updateEmailTemplateAction(input: {
  id: string;
  subject: string;
  heading: string;
  bodyIntro: string;
  footerNote: string;
  ctaText?: string;
  active: boolean;
}) {
  const admin = await requireAdmin();
  await prisma.emailTemplate.update({
    where: { id: input.id },
    data: {
      subject: sanitizeText(input.subject),
      heading: sanitizeText(input.heading),
      bodyIntro: input.bodyIntro.trim(),
      footerNote: input.footerNote.trim(),
      ctaText: sanitizeText(input.ctaText),
      active: input.active
    }
  });
  await logAdminAction(admin, "UPDATE_EMAIL_TEMPLATE", "EmailTemplate", input.id, `Updated email template ${input.subject}`);
  revalidatePath("/admin/email-templates");
  return { success: true };
}

// 11. Admin Users Management (SUPER_ADMIN only)
export async function saveAdminUserAction(input: {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: AdminRole;
  active: boolean;
}) {
  const admin = await requireAdmin([AdminRole.SUPER_ADMIN]);
  const cleanEmail = input.email.trim().toLowerCase();

  if (input.id) {
    const updateData: {
      name: string;
      email: string;
      role: AdminRole;
      active: boolean;
      passwordHash?: string;
    } = {
      name: sanitizeText(input.name),
      email: cleanEmail,
      role: input.role,
      active: input.active
    };
    if (input.password && input.password.trim().length >= 6) {
      updateData.passwordHash = await bcrypt.hash(input.password.trim(), 10);
    }
    await prisma.user.update({
      where: { id: input.id },
      data: updateData
    });
  } else {
    const pwd = input.password && input.password.trim().length >= 6 ? input.password.trim() : "EllaAdmin2026!";
    const passwordHash = await bcrypt.hash(pwd, 10);
    await prisma.user.create({
      data: {
        name: sanitizeText(input.name),
        email: cleanEmail,
        passwordHash,
        role: input.role,
        active: input.active
      }
    });
  }

  await logAdminAction(admin, "SAVE_ADMIN_USER", "User", cleanEmail, `Saved admin user ${cleanEmail} (${input.role})`);
  revalidatePath("/admin/users");
  return { success: true };
}

