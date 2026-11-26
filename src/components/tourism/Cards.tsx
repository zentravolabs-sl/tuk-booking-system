import React from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
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

function getPackagePhotoByName(pkg: {
  name: string;
  slug: string;
  coverImage: string;
}): string {
  if (
    pkg.coverImage &&
    !pkg.coverImage.includes("images.unsplash.com") &&
    !pkg.coverImage.startsWith("/images/packages/")
  ) {
    return pkg.coverImage;
  }
  const text = `${pkg.name} ${pkg.slug}`.toLowerCase();
  if (text.includes("iconic") || text.includes("highlights"))
    return "/images/packages/ella-iconic-highlights-safari.jpg";
  if (text.includes("lipton") || text.includes("diyaluma"))
    return "/images/packages/sunrise-liptons-seat-upper-diyaluma.jpg";
  if (text.includes("trekker") || text.includes("peaks") || text.includes("ella rock"))
    return "/images/packages/ella-golden-sunrise-peaks-trekker.jpg";
  return pkg.coverImage;
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
          src={getPackagePhotoByName(pkg)}
          alt={pkg.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className="bg-[#E8B44C] text-[#0B3024] text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-sm">
            {badgeLabel || (pkg.popular ? "Most Popular" : "Best Value")}
          </span>
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
            href={`/tours/${pkg.slug}`}
            className="w-10 h-10 rounded-xl bg-[#164B35] hover:bg-[#0B3024] text-white flex items-center justify-center shadow-sm transition group-hover:scale-105"
            title="View Package"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
