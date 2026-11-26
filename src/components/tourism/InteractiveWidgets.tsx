"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Tag,
  Copy,
  Check,
  Star,
  ChevronDown,
  Quote,
  Calendar,
  ArrowRight,
  Sparkles
} from "lucide-react";

function getOfferPhotoByName(offer: {
  title: string;
  image: string;
}): string {
  if (
    offer.image &&
    !offer.image.includes("images.unsplash.com") &&
    !offer.image.startsWith("/images/offers/")
  ) {
    return offer.image;
  }
  const text = offer.title.toLowerCase();
  if (text.includes("couple") || text.includes("group") || text.includes("20%"))
    return "/images/offers/offer-highland-welcome.jpg";
  if (text.includes("sunrise") || text.includes("lipton") || text.includes("diyaluma"))
    return "/images/offers/special-offer-ella-gap.jpg";
  if (text.includes("welcome") || text.includes("first"))
    return "/images/packages/ella-iconic-highlights-safari.jpg";
  return "/images/offers/offer-highland-welcome.jpg";
}

export function OfferCard({
  offer
}: {
  offer: {
    id: string;
    title: string;
    description: string;
    badgeText?: string | null;
    image: string;
    discountType: string;
    discountValue: number;
    couponCode?: string | null;
    minBookingAmount: number;
    endDate: Date | string;
  };
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!offer.couponCode) return;
    navigator.clipboard.writeText(offer.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-brand-deep text-white rounded-3xl overflow-hidden border border-brand-gold/30 shadow-premium flex flex-col md:flex-row">
      <div className="relative md:w-2/5 h-56 md:h-auto overflow-hidden">
        <img
          src={getOfferPhotoByName(offer)}
          alt={offer.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-deep via-brand-deep/40 to-transparent" />
        <span className="absolute top-4 left-4 bg-brand-gold text-brand-deep text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          {offer.badgeText || "LIMITED TIME OFFER"}
        </span>
      </div>

      <div className="p-6 sm:p-8 md:w-3/5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>
              {offer.discountType === "PERCENTAGE"
                ? `Save ${offer.discountValue}% Instantly`
                : `Save $${offer.discountValue} Instantly`}
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
            {offer.title}
          </h3>
          <p className="text-sm text-brand-cream/80 mt-2.5 leading-relaxed">
            {offer.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          {offer.couponCode ? (
            <div className="flex items-center gap-2">
              <div className="bg-white/10 border border-dashed border-brand-gold/60 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-brand-gold" />
                <span className="font-mono font-bold text-sm tracking-wider text-brand-gold">
                  {offer.couponCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl bg-brand-forest hover:bg-brand-forest/80 text-xs font-semibold text-white flex items-center gap-1.5 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-gold" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          ) : (
            <span className="text-xs text-brand-cream/70 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-gold" />
              Auto-applied at checkout
            </span>
          )}

          <Link
            href="/#our-rides"
            className="bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-sm"
          >
            <span>Redeem Offer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ReviewCard({
  review
}: {
  review: {
    id: string;
    customerName: string;
    country: string;
    rating: number;
    title?: string | null;
    comment: string;
    tourTitle?: string | null;
    travelDate?: string | null;
  };
}) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-forest/10 shadow-card flex flex-col justify-between h-full relative">
      <Quote className="w-10 h-10 text-brand-gold/20 absolute top-6 right-6" />
      <div>
        <div className="flex items-center gap-1 text-brand-gold mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? "fill-brand-gold text-brand-gold" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        {review.title && (
          <h4 className="font-serif font-bold text-lg text-brand-dark mb-2">
            &ldquo;{review.title}&rdquo;
          </h4>
        )}
        <p className="text-sm text-brand-dark/80 leading-relaxed">
          {review.comment}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-brand-forest/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-forest text-brand-gold font-bold flex items-center justify-center text-sm">
            {review.customerName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-brand-dark">{review.customerName}</p>
            <p className="text-xs text-brand-dark/60">
              {review.country} {review.travelDate ? `• ${review.travelDate}` : ""}
            </p>
          </div>
        </div>
        {review.tourTitle && (
          <span className="text-[11px] font-semibold bg-brand-cream text-brand-forest px-2.5 py-1 rounded-full border border-brand-forest/15 max-w-[140px] truncate">
            {review.tourTitle}
          </span>
        )}
      </div>
    </div>
  );
}

export function FAQAccordion({
  faqs
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3.5">
      {faqs.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-brand-forest/15 overflow-hidden transition-all"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-brand-cream/40 transition"
            >
              <span className="font-serif font-bold text-base sm:text-lg text-brand-dark">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-brand-forest shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 pt-1 text-sm text-brand-dark/80 leading-relaxed border-t border-brand-forest/5">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

