import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReviewCard } from "@/components/tourism/InteractiveWidgets";
import { ReviewSubmissionForm } from "@/components/tourism/ReviewSubmissionForm";
import {
  HeartHandshake,
  ShieldCheck,
  Award,
  Users,
  ArrowRight,
  Sparkles
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Ella Tuk Tuk Taxi Service | Local Community Drivers & Reviews",
  description:
    "Meet the local Ella highland drivers behind Ella Tuk Tuk Taxi Service. Read our story, mission, and verified traveler reviews."
};

export default async function AboutPage() {
  const [settings, reviews] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.customerReview.findMany({
      where: { status: "APPROVED" },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
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
            <span>100% Community-Owned Highland Fleet</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-3 max-w-3xl">
            {settings?.aboutHeadline ||
              "Born in the Misty Hills of Ella, Driven by Local Hospitality"}
          </h1>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-premium border border-brand-forest/15 h-[420px]">
            <img
              src={
                settings?.aboutImage ||
                "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1400&q=85"
              }
              alt="Ella Highland Tea Valleys"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 bg-brand-deep/90 backdrop-blur-md text-white p-5 rounded-2xl border border-brand-gold/30">
              <p className="font-serif text-lg font-bold text-brand-gold">
                &ldquo;Ayubowan — May You Live Long in Health and Happiness&rdquo;
              </p>
              <p className="text-xs text-brand-cream/85 mt-1">
                Our traditional Sri Lankan greeting at the start of every Tuk Tuk journey.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-forest bg-brand-forest/10 px-3.5 py-1.5 rounded-full">
              Our Highland Story
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-dark">
              More Than a Ride — Your Local Friends in Ella
            </h2>
            <p className="text-sm sm:text-base text-brand-dark/80 leading-relaxed whitespace-pre-line">
              {settings?.aboutStory}
            </p>
            <div className="bg-white rounded-2xl p-5 border-l-4 border-brand-gold shadow-card">
              <h3 className="font-serif font-bold text-base text-brand-dark mb-1">
                Our Community Mission
              </h3>
              <p className="text-sm text-brand-dark/75 leading-relaxed">
                {settings?.aboutMission}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-brand-forest/10 text-center">
                <span className="block font-serif text-2xl font-black text-brand-forest">
                  25+
                </span>
                <span className="text-xs text-brand-dark/65 font-medium">
                  Local Owner-Drivers
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-brand-forest/10 text-center">
                <span className="block font-serif text-2xl font-black text-brand-forest">
                  12,000+
                </span>
                <span className="text-xs text-brand-dark/65 font-medium">
                  Happy Guests Hosted
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-brand-forest/10 text-center">
                <span className="block font-serif text-2xl font-black text-brand-forest">
                  4.98 ★
                </span>
                <span className="text-xs text-brand-dark/65 font-medium">
                  Verified Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white border-y border-brand-forest/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-brand-cream/60 border border-brand-forest/10">
            <ShieldCheck className="w-8 h-8 text-brand-forest mb-3" />
            <h3 className="font-serif text-xl font-bold text-brand-dark">
              Safety & Maintenance First
            </h3>
            <p className="text-sm text-brand-dark/75 mt-2 leading-relaxed">
              Every Tuk Tuk in our fleet undergoes weekly brake, tire, and mountain-grade
              engine inspections for steep highland climbs like Lipton&apos;s Seat.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-brand-cream/60 border border-brand-forest/10">
            <HeartHandshake className="w-8 h-8 text-brand-forest mb-3" />
            <h3 className="font-serif text-xl font-bold text-brand-dark">
              Honest & Fixed Pricing
            </h3>
            <p className="text-sm text-brand-dark/75 mt-2 leading-relaxed">
              We publish all our destination and package prices online so international
              visitors never have to haggle or worry about tourist overcharging.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-brand-cream/60 border border-brand-forest/10">
            <Award className="w-8 h-8 text-brand-forest mb-3" />
            <h3 className="font-serif text-xl font-bold text-brand-dark">
              Local Knowledge & Storytelling
            </h3>
            <p className="text-sm text-brand-dark/75 mt-2 leading-relaxed">
              Our drivers share the real history of Ceylon tea, the British railway loops,
              and the ancient legends of King Ravana along the way.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews & Review Submission */}
      <section id="reviews" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-forest bg-brand-forest/10 px-3.5 py-1.5 rounded-full">
            Verified Traveler Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-3">
            What Our Guests Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>

        <div className="max-w-3xl mx-auto pt-6">
          <ReviewSubmissionForm />
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}

