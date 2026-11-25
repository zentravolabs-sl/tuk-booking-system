import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MultiStepBookingWizard } from "@/components/booking/MultiStepBookingWizard";
import { BookingType } from "@prisma/client";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book Your Ella Tuk Tuk Ride, Tour Package or Airport Transfer Online",
  description:
    "Reserve your private Ella Tuk Tuk ride, Nine Arch Bridge excursion, or full-day highland safari in 7 easy steps with instant confirmation."
};

export default async function BookPage({
  searchParams
}: {
  searchParams: {
    type?: string;
    destinationId?: string;
    tourPackageId?: string;
    date?: string;
    passengers?: string;
    coupon?: string;
  };
}) {
  const [settings, destinations, packages] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.destination.findMany({
      where: { active: true },
      orderBy: [{ popular: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        shortDescription: true,
        price: true,
        finalPrice: true,
        distance: true,
        travelTime: true,
        coverImage: true
      }
    }),
    prisma.tourPackage.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        tagline: true,
        duration: true,
        price: true,
        finalPrice: true,
        coverImage: true
      }
    })
  ]);

  const validTypes: BookingType[] = [
    "DESTINATION_RIDE",
    "TOUR_PACKAGE",
    "CUSTOM_TOUR",
    "AIRPORT_TRANSFER",
    "HOTEL_PICKUP",
    "TRAIN_STATION_PICKUP",
    "TAXI_TRANSFER"
  ];

  const initialType: BookingType = validTypes.includes(searchParams.type as BookingType)
    ? (searchParams.type as BookingType)
    : searchParams.tourPackageId
      ? "TOUR_PACKAGE"
      : "DESTINATION_RIDE";

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar phone={settings?.phone} />

      <section className="bg-brand-deep text-white py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-gold bg-white/10 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Online Reservation • Zero Booking Fees</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-3">
            Book Your Ella Tuk Tuk Adventure
          </h1>
          <p className="text-brand-cream/85 text-sm sm:text-base mt-2 max-w-2xl">
            Complete the quick steps below. All prices are calculated live from our
            official database rates with automatic coupon verification.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <MultiStepBookingWizard
          destinations={destinations}
          packages={packages}
          initialType={initialType}
          initialDestinationId={searchParams.destinationId || ""}
          initialPackageId={searchParams.tourPackageId || ""}
          initialDate={searchParams.date || ""}
          initialPassengers={Number(searchParams.passengers) || 2}
          initialCoupon={searchParams.coupon || ""}
        />
      </section>

      <Footer settings={settings} />
    </div>
  );
}

