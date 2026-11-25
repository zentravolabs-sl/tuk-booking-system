import React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  Calendar,
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
    <span className="inline-flex items-center gap-1 bg-[#E8B44C] text-[#0B3024] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
      <Tag className="w-3 h-3" />
      {label}
    </span>
  );
}

/**
 * Compact Overlay Portrait Card matching the "Popular Destinations" 4-column grid in the design image
 */
export function PopularDestinationOverlayCard({
  destination
}: {
  destination: {
    id: string;
    name: string;
    slug: string;
    coverImage: string;
    location?: string;
    distance?: string;
    finalPrice: number;
    currency: string;
  };
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative h-72 sm:h-80 rounded-3xl overflow-hidden shadow-card hover:shadow-premium transition-all duration-300 block bg-[#0B3024]"
    >
      <img
        src={destination.coverImage}
        alt={destination.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Top right Heart icon */}
      <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm border border-white/25 text-white flex items-center justify-center group-hover:bg-[#E8B44C] group-hover:text-[#0B3024] transition">
        <Heart className="w-4 h-4" />
      </div>

      {/* Bottom Title & Location */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug group-hover:text-[#E8B44C] transition-colors">
          {destination.name}
        </h3>
        <div className="flex items-center justify-between mt-1 text-xs text-white/80">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#E8B44C] shrink-0" />
            {destination.location || "Ella, Sri Lanka"}
          </span>
          <span className="font-bold text-[#E8B44C] shrink-0 ml-2">
            ${destination.finalPrice}
          </span>
        </div>
      </div>
    </Link>
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
    <div className="group bg-white rounded-3xl overflow-hidden border border-[#164B35]/10 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col h-full">
      <div className="relative h-56 w-full overflow-hidden bg-[#0B3024]">
        <img
          src={destination.coverImage}
          alt={destination.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          {destination.popular ? (
            <span className="bg-[#E8B44C] text-[#0B3024] text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm">
              Most Popular
            </span>
          ) : (
            <span className="bg-black/45 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full">
              {destination.category?.name || "Ella Ride"}
            </span>
          )}
          <DiscountBadge
            discountType={destination.discountType}
            discountValue={destination.discountValue}
            currency={destination.currency}
          />
        </div>

        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/90">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#E8B44C]" />
            {destination.distance}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#E8B44C]" />
            {destination.travelTime}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/destinations/${destination.slug}`}>
            <h3 className="font-serif text-xl font-bold text-[#202820] group-hover:text-[#164B35] transition-colors line-clamp-1">
              {destination.name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
            {destination.shortDescription}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 font-medium block">
              From
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-[#0B3024]">
                {formatCurrency(destination.finalPrice, destination.currency)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(destination.price, destination.currency)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/destinations/${destination.slug}`}
              className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#202820] hover:bg-gray-50 transition"
            >
              Details
            </Link>
            <Link
              href={`/book?type=DESTINATION_RIDE&destinationId=${destination.id}`}
              className="w-10 h-10 rounded-xl bg-[#164B35] hover:bg-[#0B3024] text-white flex items-center justify-center shadow-sm transition"
              title="Book Now"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TourPackageCard matching the "HANDPICKED Our Tour Packages" design in the mockup
 */
export function TourPackageCard({
  pkg,
  badgeLabel
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
  badgeLabel?: string;
}) {
  const hasDiscount =
    pkg.discountType !== "NONE" && pkg.discountValue > 0 && pkg.finalPrice < pkg.price;

  const stopNames =
    pkg.destinations && pkg.destinations.length > 0
      ? pkg.destinations.map((d) => d.destination.name).join(", ")
      : "Nine Arch Bridge, Little Adam's Peak, Ravana Falls";

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col h-full">
      {/* Top Image with yellow pill badge */}
      <div className="relative h-56 w-full overflow-hidden bg-[#0B3024]">
        <img
          src={pkg.coverImage}
          alt={pkg.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className="bg-[#E8B44C] text-[#0B3024] text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-sm">
            {badgeLabel || (pkg.popular ? "Most Popular" : "Best Value")}
          </span>
          <div className="w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm text-white flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Card Body matching mockup */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/tours/${pkg.slug}`}>
            <h3 className="font-serif text-xl font-bold text-[#202820] group-hover:text-[#164B35] transition-colors">
              {pkg.name}
            </h3>
          </Link>

          <div className="mt-3 space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#164B35] shrink-0" />
              <span>{pkg.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#164B35] shrink-0" />
              <span className="truncate">{stopNames}</span>
            </div>
          </div>
        </div>

        {/* Bottom Price + Green Square Arrow Button */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-gray-500 font-medium">From</span>
            <span className="text-xl font-extrabold text-[#202820]">
              {formatCurrency(pkg.finalPrice, pkg.currency)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(pkg.price, pkg.currency)}
              </span>
            )}
          </div>

          <Link
            href={`/book?type=TOUR_PACKAGE&tourPackageId=${pkg.id}`}
            className="w-10 h-10 rounded-xl bg-[#164B35] hover:bg-[#0B3024] text-white flex items-center justify-center shadow-sm transition group-hover:scale-105"
            title="Book Package"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
