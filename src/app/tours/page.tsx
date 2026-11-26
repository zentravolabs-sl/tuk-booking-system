import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TourPackageCard } from "@/components/tourism/Cards";
import { Sparkles, Compass, CheckCircle2, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Curated Ella Tour Packages & Full-Day Tuk Tuk Safaris | Sri Lanka",
  description:
    "Explore our all-inclusive Ella Tuk Tuk tour packages: Full-Day Iconic Highlights Safari, Lipton's Seat Sunrise & Upper Diyaluma Expedition, and Golden Sunrise Trekker."
};

export default async function ToursPage() {
  const [settings, packages] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.tourPackage.findMany({
      where: { active: true },
      include: {
        destinations: {
          include: { destination: { select: { name: true, slug: true } } },
          orderBy: { stopOrder: "asc" }
        }
      },
      orderBy: [{ featured: "desc" }, { popular: "desc" }, { createdAt: "asc" }]
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
            <span>Multi-Stop Highland Circuits</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-3">
            Curated Ella Tuk Tuk Tour Packages
          </h1>
          <p className="text-brand-cream/85 text-sm sm:text-base mt-3 max-w-2xl">
            Experience Ella&apos;s best viewpoints, railway bridges, tea factories, and
            natural infinity pools in seamlessly timed half-day and full-day private
            packages.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <TourPackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* Custom Charter Banner */}
        <div className="mt-16 bg-brand-forest text-white rounded-3xl p-8 sm:p-10 shadow-premium flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
              <Compass className="w-4 h-4" />
              Tailor-Made Highland Charter
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Want to Design Your Own Custom Ella Tuk Tuk Itinerary?
            </h2>
            <p className="text-sm text-brand-cream/85 mt-2 leading-relaxed">
              Hire a private Tuk Tuk and local English-speaking driver by the half-day or
              full-day. Stop wherever you like and travel completely at your own pace.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-brand-cream/90">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Flexible Pickup Time
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Unlimited Photo Stops
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Up to 3 Guests per Tuk Tuk
              </span>
            </div>
          </div>

          <Link
            href="/contact"
            className="px-7 py-4 rounded-2xl bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-extrabold text-sm shadow-md transition flex items-center gap-2 shrink-0"
          >
            <span>Request Custom Charter</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}

