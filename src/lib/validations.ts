import { z } from "zod";

const imageUrlOrPath = z
  .string()
  .min(2, "Image is required")
  .refine(
    (val) =>
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/uploads/") ||
      val.startsWith("data:image/"),
    "Please upload an image or provide a valid image URL"
  );

export const bookingFormSchema = z.object({
  bookingType: z.enum([
    "DESTINATION_RIDE",
    "TOUR_PACKAGE",
    "CUSTOM_TOUR",
    "AIRPORT_TRANSFER",
    "HOTEL_PICKUP",
    "TRAIN_STATION_PICKUP",
    "TAXI_TRANSFER"
  ]),
  destinationId: z.string().optional().nullable(),
  tourPackageId: z.string().optional().nullable(),
  customTitle: z.string().optional().nullable(),
  bookingDate: z.string().min(1, "Please select your booking date"),
  bookingTime: z.string().min(1, "Please select a pickup time"),
  passengers: z.coerce
    .number()
    .int()
    .min(1, "At least 1 passenger is required")
    .max(18, "Maximum 18 passengers per group"),
  pickupLocation: z.string().min(3, "Please enter your pickup location or hotel"),
  dropoffLocation: z.string().optional().nullable(),
  hotelName: z.string().optional().nullable(),
  customerName: z.string().min(2, "Please enter your full name"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(6, "Please enter a valid phone / WhatsApp number"),
  customerCountry: z.string().min(2, "Please enter your country"),
  specialRequests: z.string().max(1000).optional().nullable(),
  couponCode: z.string().optional().nullable()
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const destinationFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  shortDescription: z.string().min(10, "Short description is required"),
  description: z.string().min(20, "Full description is required"),
  categoryId: z.string().min(1, "Category is required"),
  coverImage: imageUrlOrPath,
  galleryUrls: z.string().optional(),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  currency: z.string().default("USD"),
  priceType: z.enum(["PER_TRIP", "PER_PERSON", "PER_HOUR", "PER_DAY"]).default("PER_TRIP"),
  discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
  discountValue: z.coerce.number().min(0).default(0),
  distance: z.string().min(1, "Distance is required"),
  travelTime: z.string().min(1, "Travel time is required"),
  entranceFee: z.string().default("Free Entry"),
  location: z.string().default("Ella, Sri Lanka"),
  googleMapsUrl: z.string().optional().nullable(),
  includedServicesText: z.string().optional(),
  highlightsText: z.string().optional(),
  bestTimeToVisit: z.string().optional(),
  popular: z.boolean().default(false),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable()
});

export const tourPackageFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Package name is required"),
  slug: z.string().min(3, "Slug is required"),
  tagline: z.string().min(3, "Tagline is required"),
  shortDescription: z.string().min(10, "Short description is required"),
  description: z.string().min(20, "Full description is required"),
  coverImage: imageUrlOrPath,
  galleryUrls: z.string().optional(),
  duration: z.string().min(2, "Duration is required"),
  startTime: z.string().default("08:00 AM"),
  endTime: z.string().default("04:00 PM"),
  minPassengers: z.coerce.number().min(1).default(1),
  maxPassengers: z.coerce.number().min(1).default(3),
  price: z.coerce.number().min(1, "Price is required"),
  currency: z.string().default("USD"),
  discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
  discountValue: z.coerce.number().min(0).default(0),
  inclusionsText: z.string().optional(),
  exclusionsText: z.string().optional(),
  itineraryJson: z.string().optional(),
  destinationIds: z.array(z.string()).default([]),
  terms: z.string().optional().nullable(),
  popular: z.boolean().default(false),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable()
});

export const offerFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Offer title is required"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  badgeText: z.string().optional().nullable(),
  image: imageUrlOrPath,
  offerType: z.enum([
    "PERCENTAGE_DISCOUNT",
    "FIXED_DISCOUNT",
    "FIRST_BOOKING",
    "SEASONAL_OFFER",
    "DESTINATION_DISCOUNT",
    "PACKAGE_DISCOUNT",
    "COUPON_CODE",
    "LIMITED_TIME"
  ]),
  discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number().min(0),
  couponCode: z.string().optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  minBookingAmount: z.coerce.number().min(0).default(0),
  maxDiscount: z.coerce.number().optional().nullable(),
  usageLimit: z.coerce.number().optional().nullable(),
  perCustomerLimit: z.coerce.number().min(1).default(1),
  featured: z.boolean().default(true),
  active: z.boolean().default(true)
});

export const couponFormSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(3, "Coupon code is required").toUpperCase(),
  title: z.string().min(2, "Title is required"),
  description: z.string().optional().nullable(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number().min(1),
  minBookingAmount: z.coerce.number().min(0).default(0),
  maxDiscount: z.coerce.number().optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  usageLimit: z.coerce.number().optional().nullable(),
  perCustomerLimit: z.coerce.number().min(1).default(1),
  firstBookingOnly: z.boolean().default(false),
  active: z.boolean().default(true)
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Your name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().optional().nullable(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000)
});

export const reviewSubmissionSchema = z.object({
  customerName: z.string().min(2, "Your name is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  country: z.string().min(2, "Country is required"),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().min(3, "Headline is required"),
  comment: z.string().min(15, "Please share a bit more about your experience"),
  bookingReference: z.string().optional().nullable(),
  tourTitle: z.string().optional().nullable(),
  destinationId: z.string().optional().nullable(),
  tourPackageId: z.string().optional().nullable()
});
