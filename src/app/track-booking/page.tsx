import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookingTrackerClient } from "@/components/booking/BookingTrackerClient";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Track Your Ella Tuk Tuk Booking Status | Secure Reference Lookup",
  description:
    "Enter your booking reference (ELLA-YYYY-XXXXXX) and email address to view your live booking status, assigned driver, and printable trip voucher."
};

export default async function TrackBookingPage({
  searchParams
}: {
  searchParams: { ref?: string; email?: string };
}) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar phone={settings?.phone} />

      <section className="bg-brand-deep text-white py-14 border-b border-white/10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-gold bg-white/10 px-3.5 py-1.5 rounded-full">
            <Search className="w-3.5 h-3.5" />
            <span>Live Dispatch Status & Printable Voucher</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-3">
            Track Your Booking
          </h1>
          <p className="text-brand-cream/85 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Enter your unique booking reference and the email address used during checkout
            to view your live reservation status and assigned driver.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <BookingTrackerClient
          initialRef={searchParams.ref || ""}
          initialEmail={searchParams.email || ""}
        />
      </section>

      <Footer settings={settings} />
    </div>
  );
}

