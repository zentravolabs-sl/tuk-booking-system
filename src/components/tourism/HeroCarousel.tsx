"use client";

import React from "react";

const HERO_SLIDES = [
  {
    image: "/images/ella-hero-nine-arch.jpg",
    subtitle: "EXPLORE SRI LANKA",
    titleBefore: "Discover the Beauty of",
    titleHighlight: "Ella",
    titleAfter: "& Beyond",
    description:
      "Breathtaking landscapes, tea hills, waterfalls and unforgettable adventures."
  },
  {
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2000&q=85",
    subtitle: "SUNRISE HIGHLAND TOURS",
    titleBefore: "Experience the Magic of",
    titleHighlight: "Lipton's Seat",
    titleAfter: "& Peaks",
    description:
      "Ride with trusted local Ella Tuk Tuk guides to misty mountain summits and hidden tea trails."
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85",
    subtitle: "WATERFALL EXPEDITIONS",
    titleBefore: "Swim Atop Majestic",
    titleHighlight: "Diyaluma",
    titleAfter: "& Ravana Falls",
    description:
      "Private half-day and full-day Tuk Tuk safaris to Sri Lanka's most spectacular natural infinity pools."
  }
];

export function HeroCarousel() {
  const slide = HERO_SLIDES[0];

  return (
    <section className="relative bg-[#0B3024] text-white h-[540px] sm:h-[600px] lg:h-[640px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt="Nine Arch Bridge Blue Train Ella Sri Lanka"
          className="w-full h-full object-cover object-center transition-all duration-700"
        />
        {/* Subtle left gradient for crisp white/golden typography while keeping the blue train bright on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071f17]/80 via-[#071f17]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071f17]/60 via-transparent to-black/20" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
        <div className="max-w-2xl">
          <span className="block text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-white/95 mb-3">
            {slide.subtitle}
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-[64px] font-bold text-white leading-[1.1] tracking-tight drop-shadow-sm">
            {slide.titleBefore} <br />
            <span className="text-[#E8B44C] italic font-serif">
              {slide.titleHighlight}
            </span>{" "}
            <span className="italic font-serif">{slide.titleAfter}</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-lg font-normal drop-shadow">
            {slide.description}
          </p>
        </div>
      </div>
    </section>
  );
}

