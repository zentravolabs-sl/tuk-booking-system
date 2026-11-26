import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookingTrackerClient } from "@/components/booking/BookingTrackerClient";
import { Search, User, ArrowRight, CheckCircle2 } from "lucide-react";

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
  const [settings, customer] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    getCurrentCustomer()
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar
        phone={settings?.phone}
        initialCustomer={
          customer
            ? {
                id: customer.id,
                fullName: customer.fullName,
                email: customer.email
              }
            : null
        }
      />

      <section className="bg-brand-deep text-white py-14 border-b border-white/10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-gold bg-white/10 px-3.5 py-1.5 rounded-full">
            <Search className="w-3.5 h-3.5" />
            <span>Live Dispatch Status &amp; Printable Voucher</span>
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

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full space-y-6">
        <div className="max-w-4xl mx-auto bg-[#0B3024] text-white rounded-3xl p-5 sm:p-6 border border-[#E8B44C]/30 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#164B35] text-[#E8B44C] flex items-center justify-center shrink-0">
              {customer ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              {customer ? (
                <>
                  <h2 className="font-serif text-lg font-bold text-white">
                    Logged in as {customer.fullName} ({customer.email})
                  </h2>
                  <p className="text-xs text-white/80">
                    Open your Customer Dashboard to view all your booked Tour Packages and Tuk Tuk Rides in one place.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-serif text-lg font-bold text-white">
                    Want to view all your Tour Packages &amp; Rides in one place?
                  </h2>
                  <p className="text-xs text-white/80">
                    Sign in to your Customer Dashboard or register with your email OTP to view all your bookings anytime.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {customer ? (
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-xl bg-[#E8B44C] hover:bg-[#f3c15a] text-[#0B3024] font-extrabold text-xs inline-flex items-center gap-1.5 transition"
              >
                <span>Open My Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2.5 rounded-xl bg-[#E8B44C] hover:bg-[#f3c15a] text-[#0B3024] font-extrabold text-xs inline-flex items-center gap-1.5 transition"
                >
                  <span>Customer Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <BookingTrackerClient
          initialRef={searchParams.ref || ""}
          initialEmail={searchParams.email || customer?.email || ""}
        />
      </section>

      <Footer settings={settings} />
    </div>
  );
}
