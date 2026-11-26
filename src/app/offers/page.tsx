import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OfferCard } from "@/components/tourism/InteractiveWidgets";
import { Tag, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Special Offers, Promo Codes & Tuk Tuk Discounts | Ella Sri Lanka",
  description:
    "Save up to 20% on Ella Tuk Tuk tours, sunrise expeditions, and airport transfers with our verified promo codes and seasonal highland deals."
};

export default async function OffersPage() {
  const now = new Date();
  const [settings, activeOffers, activeCoupons] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.offer.findMany({
      where: {
        active: true,
        endDate: { gte: now }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.coupon.findMany({
      where: {
        active: true,
        endDate: { gte: now }
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar phone={settings?.phone} />

      {/* Hero */}
      <section className="bg-brand-deep text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-gold bg-white/10 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Highland Deals & Promo Codes</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-3">
            Special Offers & Discount Coupons
          </h1>
          <p className="text-brand-cream/85 text-sm sm:text-base mt-3 max-w-2xl">
            Copy any active coupon code below and enter it during Step 6 of our booking
            engine for instant server-validated savings. Expired offers are automatically
            hidden.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full space-y-14">
        {/* Featured Offer Banners */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
            Active Promotional Campaigns ({activeOffers.length})
          </h2>
          {activeOffers.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-brand-forest/15">
              <p className="text-sm text-brand-dark/70">
                No seasonal campaigns active right now. Check out our direct promo codes
                below!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {activeOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </div>

        {/* Verified Coupon Codes Table / Grid */}
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mb-6">
            Active Coupon Codes You Can Apply at Checkout
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-3xl p-6 border-2 border-dashed border-brand-forest/25 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 font-mono font-extrabold text-sm bg-brand-forest text-brand-gold px-3.5 py-1.5 rounded-xl">
                      <Tag className="w-3.5 h-3.5" />
                      {coupon.code}
                    </span>
                    <span className="text-xs font-extrabold text-brand-forest bg-brand-forest/10 px-2.5 py-1 rounded-full">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}% OFF`
                        : `$${coupon.discountValue} OFF`}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-dark">
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-brand-dark/75 mt-1.5 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-brand-forest/10 flex items-center justify-between text-xs">
                  <span className="text-brand-dark/60 font-medium">
                    Min Booking: <strong>${coupon.minBookingAmount}</strong>
                  </span>
                  <Link
                    href="/#our-rides"
                    className="font-bold text-brand-forest hover:text-brand-deep flex items-center gap-1"
                  >
                    <span>Use Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fair Coupon Policy Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-forest/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-brand-forest shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-base text-brand-dark">
                100% Server-Verified Discount Guarantee
              </h3>
              <p className="text-xs text-brand-dark/70 mt-0.5">
                All promotional discounts and coupon codes are calculated automatically on
                our secure booking server before you submit your reservation.
              </p>
            </div>
          </div>
          <Link
            href="/#our-rides"
            className="px-6 py-3 rounded-xl bg-brand-forest text-white text-xs font-bold shrink-0 hover:bg-brand-deep transition"
          >
            View Our Rides
          </Link>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}

