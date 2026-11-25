import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DestinationCard, DiscountBadge } from "@/components/tourism/Cards";
import { ReviewCard } from "@/components/tourism/InteractiveWidgets";
import { formatCurrency } from "@/lib/utils";
import {
  MapPin,
  Clock,
  Navigation,
  Ticket,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sun
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const destination = await prisma.destination.findUnique({
    where: { slug: params.slug }
  });

  if (!destination) {
    return { title: "Destination Not Found" };
  }

  return {
    title: destination.seoTitle || `${destination.name} Tuk Tuk Tour | Ella, Sri Lanka`,
    description: destination.seoDescription || destination.shortDescription,
    openGraph: {
      title: destination.seoTitle || destination.name,
      description: destination.shortDescription,
      images: [{ url: destination.coverImage }]
    }
  };
}

export default async function DestinationDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const destination = await prisma.destination.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 4
      }
    }
  });

  if (!destination || !destination.active) {
    notFound();
  }

  const [settings, relatedDestinations] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.destination.findMany({
      where: {
        active: true,
        id: { not: destination.id }
      },
      include: { category: true },
      orderBy: [{ popular: "desc" }, { featured: "desc" }],
      take: 3
    })
  ]);

  const hasDiscount =
    destination.discountType !== "NONE" &&
    destination.discountValue > 0 &&
    destination.finalPrice < destination.price;

  const touristDestinationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.shortDescription,
    image: destination.coverImage,
    address: {
      "@type": "PostalAddress",
      addressLocality: destination.location,
      addressCountry: "LK"
    },
    touristType: ["Sightseeing", "Nature & Waterfalls", "Tuk Tuk Adventure"]
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristDestinationJsonLd) }}
      />
      <Navbar phone={settings?.phone} />

      {/* Hero Section */}
      <section className="relative h-[440px] sm:h-[520px] bg-brand-deep text-white overflow-hidden">
        <img
          src={destination.coverImage}
          alt={destination.name}
          className="w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/45 to-black/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-8 sm:py-12">
          <div>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-cream bg-black/40 hover:bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to All Ella Destinations
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-brand-gold text-brand-deep text-xs font-extrabold px-3 py-1 rounded-full">
                {destination.category.name}
              </span>
              <DiscountBadge
                discountType={destination.discountType}
                discountValue={destination.discountValue}
                currency={destination.currency}
              />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              {destination.name}
            </h1>
            <p className="text-brand-cream/90 text-sm sm:text-lg mt-3 leading-relaxed">
              {destination.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Booking Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Description, Highlights, Gallery, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          {/* Quick Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-3xl p-5 border border-brand-forest/15 shadow-card">
            <div className="flex items-start gap-3">
              <Navigation className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] uppercase font-bold text-brand-dark/55">
                  Distance
                </span>
                <span className="text-sm font-bold text-brand-dark">
                  {destination.distance}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] uppercase font-bold text-brand-dark/55">
                  Travel Time
                </span>
                <span className="text-sm font-bold text-brand-dark">
                  {destination.travelTime}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Ticket className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] uppercase font-bold text-brand-dark/55">
                  Entrance Fee
                </span>
                <span className="text-sm font-bold text-brand-dark">
                  {destination.entranceFee}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sun className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] uppercase font-bold text-brand-dark/55">
                  Best Time
                </span>
                <span className="text-sm font-bold text-brand-dark">
                  {destination.bestTimeToVisit || "Morning / Sunset"}
                </span>
              </div>
            </div>
          </div>

          {/* Full Overview */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-brand-forest/10 shadow-card">
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
              About This Highland Experience
            </h2>
            <p className="text-brand-dark/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {destination.description}
            </p>

            {/* Highlights */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="mt-8 pt-6 border-t border-brand-forest/10">
                <h3 className="font-serif text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-gold" />
                  Trip Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.highlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 bg-brand-cream/70 p-3.5 rounded-2xl border border-brand-forest/10"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                      <span className="text-sm text-brand-dark font-medium">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included Services */}
            {destination.includedServices && destination.includedServices.length > 0 && (
              <div className="mt-8 pt-6 border-t border-brand-forest/10">
                <h3 className="font-serif text-lg font-bold text-brand-dark mb-4">
                  Included With Your Tuk Tuk Booking
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {destination.includedServices.map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-brand-dark/85">
                      <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Google Maps link */}
            <div className="mt-8 pt-6 border-t border-brand-forest/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-sm text-brand-dark">
                <MapPin className="w-5 h-5 text-brand-forest" />
                <span>
                  <strong>Location:</strong> {destination.location}
                </span>
              </div>
              {destination.googleMapsUrl && (
                <a
                  href={destination.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-forest hover:text-brand-deep bg-brand-cream px-4 py-2.5 rounded-xl border border-brand-forest/20 transition"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Image Gallery */}
          {destination.images.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Photo Gallery — {destination.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative h-60 rounded-3xl overflow-hidden bg-brand-deep shadow-card"
                  >
                    <img
                      src={img.url}
                      alt={img.altText || destination.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews for this Destination */}
          {destination.reviews.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Guest Reviews for {destination.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {destination.reviews.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-7 border border-brand-forest/15 shadow-premium">
            <div className="flex items-center justify-between pb-4 border-b border-brand-forest/10">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-dark/55">
                  {destination.priceType === "PER_PERSON"
                    ? "Price Per Person"
                    : "Private Tuk Tuk (1-3 Guests)"}
                </span>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <span className="text-3xl font-extrabold text-brand-forest">
                    {formatCurrency(destination.finalPrice, destination.currency)}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-brand-dark/45 line-through font-medium">
                      {formatCurrency(destination.price, destination.currency)}
                    </span>
                  )}
                </div>
              </div>
              <DiscountBadge
                discountType={destination.discountType}
                discountValue={destination.discountValue}
                currency={destination.currency}
              />
            </div>

            <ul className="space-y-3 py-5 text-sm text-brand-dark/85">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0" />
                <span>Free Hotel or Railway Station Pickup in Ella</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0" />
                <span>Waiting Time & Photo Stops Included</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0" />
                <span>Pay Driver After Your Ride (USD / EUR / LKR)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-forest shrink-0" />
                <span>Free Cancellation Up to 12 Hours Before</span>
              </li>
            </ul>

            <Link
              href={`/book?type=DESTINATION_RIDE&destinationId=${destination.id}`}
              className="w-full py-4 px-6 rounded-2xl bg-brand-forest hover:bg-brand-deep text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Book This Destination Ride</span>
              <ArrowRight className="w-4 h-4 text-brand-gold" />
            </Link>

            <p className="text-[11px] text-center text-brand-dark/60 mt-3">
              Instant confirmation reference generated immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Related Destinations */}
      {relatedDestinations.length > 0 && (
        <section className="py-16 bg-white border-t border-brand-forest/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
                More Highland Destinations Nearby
              </h2>
              <Link
                href="/destinations"
                className="text-sm font-bold text-brand-forest hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {relatedDestinations.map((rel) => (
                <DestinationCard key={rel.id} destination={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer settings={settings} />
    </div>
  );
}

