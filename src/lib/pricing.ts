import { prisma } from "@/lib/prisma";
import { BookingType } from "@prisma/client";

export interface ServerPricingInput {
  bookingType: BookingType;
  destinationId?: string | null;
  tourPackageId?: string | null;
  passengers: number;
  couponCode?: string | null;
  customerEmail?: string | null;
}

export interface ServerPricingResult {
  itemTitle: string;
  basePrice: number;
  itemDiscount: number;
  additionalCharges: number;
  subtotalAfterItemDiscount: number;
  couponId: string | null;
  couponCode: string | null;
  couponDiscount: number;
  couponMessage: string | null;
  couponValid: boolean;
  totalPrice: number;
  currency: string;
  tukTuksRequired: number;
}

export async function calculateServerBookingPrice(
  input: ServerPricingInput
): Promise<ServerPricingResult> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const currency = settings?.currency || "USD";
  const passengers = Math.max(1, Math.min(18, Number(input.passengers) || 1));
  const tukTuksRequired = Math.ceil(passengers / 3);

  let itemTitle = "Custom Ella Tuk Tuk Experience";
  let rawBaseUnit = 25;
  let finalBaseUnit = 25;
  let priceType = "PER_TRIP";

  if (input.bookingType === "DESTINATION_RIDE" && input.destinationId) {
    const dest = await prisma.destination.findUnique({
      where: { id: input.destinationId }
    });
    if (dest) {
      itemTitle = `${dest.name} — Tuk Tuk Ride`;
      rawBaseUnit = dest.price;
      finalBaseUnit = dest.finalPrice;
      priceType = dest.priceType;
    }
  } else if (input.bookingType === "TOUR_PACKAGE" && input.tourPackageId) {
    const pkg = await prisma.tourPackage.findUnique({
      where: { id: input.tourPackageId }
    });
    if (pkg) {
      itemTitle = `${pkg.name} (Tour Package)`;
      rawBaseUnit = pkg.price;
      finalBaseUnit = pkg.finalPrice;
      priceType = "PER_TRIP";
    }
  } else if (input.bookingType === "AIRPORT_TRANSFER") {
    itemTitle = "Private Airport / Long-Distance Transfer";
    rawBaseUnit = settings?.airportTransferRate ?? 95;
    finalBaseUnit = rawBaseUnit;
  } else if (input.bookingType === "HOTEL_PICKUP") {
    itemTitle = "Ella Hotel Pickup & Local Transfer";
    rawBaseUnit = settings?.hotelPickupRate ?? 8;
    finalBaseUnit = rawBaseUnit;
  } else if (input.bookingType === "TRAIN_STATION_PICKUP") {
    itemTitle = "Ella / Demodara Railway Station Pickup";
    rawBaseUnit = settings?.trainPickupRate ?? 5;
    finalBaseUnit = rawBaseUnit;
  } else if (input.bookingType === "CUSTOM_TOUR") {
    itemTitle = "Custom Half-Day Ella Tuk Tuk Charter (4 Hours)";
    rawBaseUnit = (settings?.customTourHourly ?? 12) * 4;
    finalBaseUnit = rawBaseUnit;
  } else if (input.bookingType === "TAXI_TRANSFER") {
    itemTitle = "Point-to-Point Highland Tuk Tuk / Taxi Transfer";
    rawBaseUnit = 30;
    finalBaseUnit = 30;
  }

  let basePrice = rawBaseUnit;
  let discountedItemTotal = finalBaseUnit;
  let additionalCharges = 0;

  if (priceType === "PER_PERSON") {
    basePrice = Number((rawBaseUnit * passengers).toFixed(2));
    discountedItemTotal = Number((finalBaseUnit * passengers).toFixed(2));
  } else {
    // Per trip covers 1 Tuk Tuk (up to 3 passengers). Additional Tuk Tuks add 85% per extra vehicle
    basePrice = Number(rawBaseUnit.toFixed(2));
    discountedItemTotal = Number(finalBaseUnit.toFixed(2));
    if (tukTuksRequired > 1) {
      additionalCharges = Number(((tukTuksRequired - 1) * finalBaseUnit * 0.85).toFixed(2));
    }
  }

  const itemDiscount = Number(Math.max(0, basePrice - discountedItemTotal).toFixed(2));
  const subtotalAfterItemDiscount = Number((discountedItemTotal + additionalCharges).toFixed(2));

  let couponId: string | null = null;
  let couponCode: string | null = null;
  let couponDiscount = 0;
  let couponMessage: string | null = null;
  let couponValid = false;

  if (input.couponCode && input.couponCode.trim().length > 0) {
    const cleanCode = input.couponCode.trim().toUpperCase();
    const now = new Date();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode }
    });

    if (!coupon || !coupon.active) {
      couponMessage = "Invalid or inactive coupon code.";
    } else if (coupon.startDate > now || coupon.endDate < now) {
      couponMessage = "This coupon code has expired.";
    } else if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      couponMessage = "This coupon has reached its maximum global usage limit.";
    } else if (subtotalAfterItemDiscount < coupon.minBookingAmount) {
      couponMessage = `Minimum booking amount of $${coupon.minBookingAmount} required for code ${cleanCode}.`;
    } else {
      let customerAllowed = true;
      if (input.customerEmail) {
        const emailLower = input.customerEmail.trim().toLowerCase();
        const priorUsages = await prisma.couponUsage.count({
          where: {
            couponId: coupon.id,
            customerEmail: emailLower
          }
        });
        if (priorUsages >= coupon.perCustomerLimit) {
          customerAllowed = false;
          couponMessage = "You have already used this coupon the maximum number of times.";
        }

        if (customerAllowed && coupon.firstBookingOnly) {
          const priorBookings = await prisma.booking.count({
            where: { customerEmail: emailLower }
          });
          if (priorBookings > 0) {
            customerAllowed = false;
            couponMessage = "This coupon is valid only for your first booking.";
          }
        }
      }

      if (customerAllowed) {
        if (coupon.discountType === "PERCENTAGE") {
          couponDiscount = (subtotalAfterItemDiscount * coupon.discountValue) / 100;
          if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
            couponDiscount = coupon.maxDiscount;
          }
        } else if (coupon.discountType === "FIXED") {
          couponDiscount = coupon.discountValue;
        }
        couponDiscount = Number(Math.min(subtotalAfterItemDiscount, couponDiscount).toFixed(2));
        couponId = coupon.id;
        couponCode = coupon.code;
        couponValid = true;
        couponMessage = `Coupon ${coupon.code} applied! You saved $${couponDiscount.toFixed(2)}.`;
      }
    }
  }

  const totalPrice = Number(Math.max(1, subtotalAfterItemDiscount - couponDiscount).toFixed(2));

  return {
    itemTitle,
    basePrice,
    itemDiscount,
    additionalCharges,
    subtotalAfterItemDiscount,
    couponId,
    couponCode,
    couponDiscount,
    couponMessage,
    couponValid,
    totalPrice,
    currency,
    tukTuksRequired
  };
}

