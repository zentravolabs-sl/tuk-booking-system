import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GalleryClient } from "@/components/tourism/GalleryClient";
import { Camera } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ella Sri Lanka Travel Gallery | Tuk Tuk Adventures, Waterfalls & Nine Arch Bridge",
  description:
    "Browse real photos from our Ella Tuk Tuk safaris, Nine Arch Bridge train crossings, Lipton's Seat sunrises, and happy travelers."
};

export default async function GalleryPage() {
  const [settings, categories, images] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.galleryCategory.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" }
    }),
    prisma.galleryImage.findMany({
      where: { visible: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }]
    })
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar phone={settings?.phone} />

      <section className="bg-brand-deep text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-gold bg-white/10 px-3.5 py-1.5 rounded-full">
            <Camera className="w-3.5 h-3.5" />
            <span>Captured in Ella & Uva Highlands</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-3">
            Highland Adventure Gallery
          </h1>
          <p className="text-brand-cream/85 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Explore moments from our Tuk Tuk fleet, iconic landmarks, misty tea valleys,
            and international guests.
          </p>
        </div>
      </section>

      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <GalleryClient categories={categories} images={images} />
      </section>

      <Footer settings={settings} />
    </div>
  );
}

