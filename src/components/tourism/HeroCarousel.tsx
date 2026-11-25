"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const slide = HERO_SLIDES[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

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

          {/* Watch Travel Video Button matching reference */}
          <div className="mt-8 flex items-center gap-5">
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="inline-flex items-center gap-3.5 group focus:outline-none"
            >
              <span className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white text-[#0B3024] border-[3px] border-[#E8B44C] flex items-center justify-center shadow-xl group-hover:scale-105 group-hover:bg-[#E8B44C] transition-all">
                <Play className="w-5 h-5 fill-[#0B3024] text-[#0B3024] ml-0.5" />
              </span>
              <span className="text-sm sm:text-base font-bold text-white group-hover:text-[#E8B44C] transition-colors drop-shadow">
                Watch Travel Video
              </span>
            </button>
          </div>
        </div>

        {/* Bottom-Right Carousel Navigation Arrows (<) (>) matching reference */}
        <div className="absolute right-4 sm:right-8 bottom-14 sm:bottom-16 flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="w-11 h-11 rounded-full bg-black/30 hover:bg-[#E8B44C] text-white hover:text-[#0B3024] border border-white/60 hover:border-[#E8B44C] backdrop-blur-sm flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="w-11 h-11 rounded-full bg-black/30 hover:bg-[#E8B44C] text-white hover:text-[#0B3024] border border-white/60 hover:border-[#E8B44C] backdrop-blur-sm flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {videoOpen && (
        <div
          onClick={() => setVideoOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0B3024] rounded-3xl overflow-hidden max-w-4xl w-full border border-[#E8B44C]/40 shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="font-serif font-bold text-lg text-white">
                Explore Ella &amp; Nine Arch Bridge by Tuk Tuk
              </span>
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 text-center space-y-5">
              <img
                src="/images/ella-hero-nine-arch.jpg"
                alt="Ella Nine Arch Bridge"
                className="w-full h-72 sm:h-96 object-cover rounded-2xl"
              />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-white/85 text-left max-w-xl">
                  Experience the iconic Blue Mountain Train at Nine Arch Bridge, Little
                  Adam&apos;s Peak sunrise, and Upper Diyaluma Falls with Kavith Tuk Tuk
                  Service.
                </p>
                <Link
                  href="/book"
                  onClick={() => setVideoOpen(false)}
                  className="px-6 py-3 rounded-full bg-[#E8B44C] text-[#0B3024] font-extrabold text-xs sm:text-sm"
                >
                  Book This Experience Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

