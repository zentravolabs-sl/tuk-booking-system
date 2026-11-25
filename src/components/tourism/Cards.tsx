import React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Navigation,
  Tag
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function DiscountBadge({
  discountType,
  discountValue,
  currency = "USD"
}: {
  discountType: string;
  discountValue: number;
  currency?: string;
}) {
  if (!discountValue || discountValue <= 0 || discountType === "NONE") return null;

  const label =
    discountType === "PERCENTAGE"
      ? `${discountValue}% OFF`
      : `SAVE ${formatCurrency(discountValue, currency)}`;

  return (
    <span className="inline-flex items-center gap-1 bg-brand-gold text-brand-deep text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
      <Tag className="w-3 h-3" />
      {label}
    </span>
  );
}

export function DestinationCard({
  destination
}: {
  destination: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    coverImage: string;
    price: number;
    finalPrice: number;
    currency: string;
    priceType: string;
    discountType: string;
    discountValue: number;
    distance: string;
    travelTime: string;
    popular: boolean;
    featured?: boolean;
    category?: { name: string } | null;
  };
}) {
  const hasDiscount =
    destination.discountType !== "NONE" &&
    destination.discountValue > 0 &&
    destination.finalPrice < destination.price;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-brand-forest/10 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-brand-deep">
        <img
          src={destination.coverImage}
          alt={destination.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-brand-deep/15 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {destination.popular && (
              <span className="inline-flex items-center gap-1 bg-brand-forest/95 backdrop-blur-sm text-brand-gold text-xs font-bold px-3 py-1 rounded-full border border-brand-gold/30">
                <Flame className="w-3.5 h-3.5 text-brand-gold" />
                Popular
              </span>
            )}
            {destination.category?.name && (
              <span className="bg-black/45 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {destination.category.name}
              </span>
            )}
          </div>
          <DiscountBadge
            discountType={destination.discountType}
            discountValue={destination.discountValue}
            currency={destination.currency}
          />
        </div>

        {/* Bottom Metadata Overlay */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-brand-cream/95 font-medium">
          <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Navigation className="w-3.5 h-3.5 text-brand-gold" />
            {destination.distance}
          </span>
          <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-brand-gold" />
            {destination.travelTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/destinations/${destination.slug}`}>
            <h3 className="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-forest transition-colors line-clamp-1">
              {destination.name}
            </h3>
          </Link>
          <p className="text-sm text-brand-dark/75 mt-2 line-clamp-2 leading-relaxed">
            {destination.shortDescription}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-brand-forest/10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-brand-dark/55 font-semibold">
                {destination.priceType === "PER_PERSON"
                  ? "Per Person"
                  : "Per Tuk Tuk (Up to 3 Guests)"}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold text-brand-forest">
                  {formatCurrency(destination.finalPrice, destination.currency)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-brand-dark/45 line-through font-medium">
                    {formatCurrency(destination.price, destination.currency)}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs font-semibold text-brand-forest bg-brand-forest/10 px-2.5 py-1 rounded-lg">
              Instant Pickup
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href={`/destinations/${destination.slug}`}
              className="py-2.5 px-3 rounded-xl border border-brand-forest/20 text-brand-forest hover:bg-brand-forest/5 font-semibold text-xs text-center transition"
            >
              View Details
            </Link>
            <Link
              href={`/book?type=DESTINATION_RIDE&destinationId=${destination.id}`}
              className="py-2.5 px-3 rounded-xl bg-brand-forest hover:bg-brand-deep text-white font-semibold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TourPackageCard({
  pkg
}: {
  pkg: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    shortDescription: string;
    coverImage: string;
    duration: string;
    maxPassengers: number;
    price: number;
    finalPrice: number;
    currency: string;
    discountType: string;
    discountValue: number;
    popular: boolean;
    destinations?: Array<{
      destination: { name: string; slug: string };
    }>;
  };
}) {
  const hasDiscount =
    pkg.discountType !== "NONE" && pkg.discountValue > 0 && pkg.finalPrice < pkg.price;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-brand-forest/15 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col h-full">
      <div className="relative h-64 w-full overflow-hidden bg-brand-deep">
        <img
          src={pkg.coverImage}
          alt={pkg.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-brand-deep/25 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 bg-brand-deep/90 backdrop-blur-sm text-brand-gold text-xs font-bold px-3 py-1.5 rounded-full border border-brand-gold/30">
            <Sparkles className="w-3.5 h-3.5" />
            {pkg.duration}
          </span>
          <DiscountBadge
            discountType={pkg.discountType}
            discountValue={pkg.discountValue}
            currency={pkg.currency}
          />
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider mb-1">
            {pkg.tagline}
          </p>
          <Link href={`/tours/${pkg.slug}`}>
            <h3 className="font-serif text-2xl font-bold text-white group-hover:text-brand-gold transition-colors">
              {pkg.name}
            </h3>
          </Link>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm text-brand-dark/75 leading-relaxed line-clamp-2">
            {pkg.shortDescription}
          </p>

          {pkg.destinations && pkg.destinations.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
                Included Highland Stops ({pkg.destinations.length}):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pkg.destinations.map((d) => (
                  <span
                    key={d.destination.slug}
                    className="inline-flex items-center gap-1 text-xs bg-brand-cream text-brand-deep font-medium px-2.5 py-1 rounded-full border border-brand-forest/15"
                  >
                    <MapPin className="w-3 h-3 text-brand-forest" />
                    {d.destination.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-brand-forest/10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-brand-dark/55 font-semibold">
                Private Package (Up to {pkg.maxPassengers} Guests)
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold text-brand-forest">
                  {formatCurrency(pkg.finalPrice, pkg.currency)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-brand-dark/45 line-through font-medium">
                    {formatCurrency(pkg.price, pkg.currency)}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs font-semibold text-brand-deep bg-brand-gold/25 px-2.5 py-1 rounded-lg">
              All-Inclusive Ride
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href={`/tours/${pkg.slug}`}
              className="py-2.5 px-3 rounded-xl border border-brand-forest/20 text-brand-forest hover:bg-brand-forest/5 font-semibold text-xs text-center transition"
            >
              View Itinerary
            </Link>
            <Link
              href={`/book?type=TOUR_PACKAGE&tourPackageId=${pkg.id}`}
              className="py-2.5 px-3 rounded-xl bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-bold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Book Package</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

