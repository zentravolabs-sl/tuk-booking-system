import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DiscountBadge } from "@/components/tourism/Cards";
import { ReviewCard } from "@/components/tourism/InteractiveWidgets";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  ShieldCheck
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pkg = await prisma.tourPackage.findUnique({ where: { slug: params.slug } });
  if (!pkg) return { title: "Tour Package Not Found" };
  return {
    title: pkg.seoTitle || `${pkg.name} | Ella Tuk Tuk Tour Package`,
    description: pkg.seoDescription || pkg.shortDescription
  };
}

export default async function TourPackageDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const pkg = await prisma.tourPackage.findUnique({
    where: { slug: params.slug },
    include: {
      destinations: {
        include: {
          destination: true
        },
        orderBy: { stopOrder: "asc" }
      },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!pkg || !pkg.active) {
    notFound();
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const itinerary = Array.isArray(pkg.itinerary)
    ? (pkg.itinerary as Array<{ time: string; title: string; description: string }>)
    : [];

  const hasDiscount =
    pkg.discountType !== "NONE" && pkg.discountValue > 0 && pkg.finalPrice < pkg.price;

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar phone={settings?.phone} />

      {/* Hero */}
      <section className="relative h-[440px] sm:h-[520px] bg-brand-deep text-white overflow-hidden">
        <img
          src={pkg.coverImage}
          alt={pkg.name}
          className="w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/45 to-black/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-8 sm:py-12">
          <div>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-cream bg-black/40 hover:bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to All Tour Packages
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-brand-gold text-brand-deep text-xs font-extrabold px-3 py-1 rounded-full">
                {pkg.duration}
              </span>
              <DiscountBadge
                discountType={pkg.discountType}
                discountValue={pkg.discountValue}
                currency={pkg.currency}
              />
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-1">
              {pkg.tagline}
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              {pkg.name}
            </h1>
            <p className="text-brand-cream/90 text-sm sm:text-lg mt-3 leading-relaxed">
              {pkg.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-3xl p-5 border border-brand-forest/15 shadow-card">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] uppercase font-bold text-brand-dark/55">
                  Duration
                </span>
                <span className="text-sm font-bold text-brand-dark">{pkg.duration}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] uppercase font-bold text-brand-dark/55">
                  Default Schedule
                </span>
                <span className="text-sm font-bold text-brand-dark">
                  {pkg.startTime} - {pkg.endTime}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] uppercase font-bold text-brand-dark/55">
                  Capacity
                </span>
                <span className="text-sm font-bold text-brand-dark">
                  {pkg.minPassengers} - {pkg.maxPassengers} Guests / Tuk Tuk
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] uppercase font-bold text-brand-dark/55">
                  Stops Included
                </span>
                <span className="text-sm font-bold text-brand-dark">
                  {pkg.destinations.length} Highland Stops
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-brand-forest/10 shadow-card">
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
              Package Overview
            </h2>
            <p className="text-brand-dark/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {pkg.description}
            </p>
          </div>

          {/* Step-by-Step Itinerary */}
          {itinerary.length > 0 && (
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-brand-forest/10 shadow-card">
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-6">
                Hour-by-Hour Tour Itinerary
              </h2>
              <div className="space-y-6 relative before:absolute before:top-3 before:bottom-3 before:left-4 before:w-0.5 before:bg-brand-forest/20">
                {itinerary.map((step, idx) => (
                  <div key={idx} className="relative pl-11">
                    <div className="w-8 h-8 rounded-full bg-brand-forest text-brand-gold font-bold text-xs flex items-center justify-center absolute left-0 top-0.5 shadow-sm">
                      {idx + 1}
                    </div>
                    <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-brand-forest bg-brand-forest/10 px-2.5 py-0.5 rounded-md mb-1">
                      {step.time}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-brand-dark">
                      {step.title}
                    </h3>
                    <p className="text-sm text-brand-dark/75 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Included Destinations */}
          {pkg.destinations.length > 0 && (
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-brand-forest/10 shadow-card">
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-5">
                Included Destinations on This Package
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkg.destinations.map((item) => (
                  <Link
                    key={item.id}
                    href={`/destinations/${item.destination.slug}`}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-brand-cream/60 border border-brand-forest/10 hover:border-brand-forest transition group"
                  >
                    <img
                      src={item.destination.coverImage}
                      alt={item.destination.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <span className="text-[11px] font-bold uppercase text-brand-forest">
                        Stop #{item.stopOrder}
                      </span>
                      <h4 className="font-serif font-bold text-brand-dark group-hover:text-brand-forest">
                        {item.destination.name}
                      </h4>
                      <p className="text-xs text-brand-dark/65">
                        {item.destination.distance}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-brand-forest/10 shadow-card">
              <h3 className="font-serif text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-forest" />
                What&apos;s Included
              </h3>
              <ul className="space-y-2.5 text-sm text-brand-dark/85">
                {pkg.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-brand-forest/10 shadow-card">
              <h3 className="font-serif text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-amber-600" />
                What&apos;s Not Included
              </h3>
              <ul className="space-y-2.5 text-sm text-brand-dark/80">
                {pkg.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reviews */}
          {pkg.reviews.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Traveler Reviews for {pkg.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pkg.reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-7 border border-brand-forest/15 shadow-premium">
            <div className="flex items-center justify-between pb-4 border-b border-brand-forest/10">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-dark/55">
                  Private Package (Up to {pkg.maxPassengers} Guests)
                </span>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <span className="text-3xl font-extrabold text-brand-forest">
                    {formatCurrency(pkg.finalPrice, pkg.currency)}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-brand-dark/45 line-through font-medium">
                      {formatCurrency(pkg.price, pkg.currency)}
                    </span>
                  )}
                </div>
              </div>
              <DiscountBadge
                discountType={pkg.discountType}
                discountValue={pkg.discountValue}
                currency={pkg.currency}
              />
            </div>

            <ul className="space-y-3 py-5 text-sm text-brand-dark/85">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0" />
                <span>Private Tuk Tuk & English-Speaking Driver-Guide</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0" />
                <span>All {pkg.destinations.length} Highland Stops & Waiting Time</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0" />
                <span>Hotel Pickup & Drop-off Anywhere in Ella</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-forest shrink-0" />
                <span>{pkg.terms || "Free cancellation up to 12 hours before."}</span>
              </li>
            </ul>

            <Link
              href={`/book?type=TOUR_PACKAGE&tourPackageId=${pkg.id}`}
              className="w-full py-4 px-6 rounded-2xl bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Reserve This Tour Package</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}

