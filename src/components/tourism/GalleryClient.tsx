"use client";

import React, { useState } from "react";
import { MapPin, X, Maximize2 } from "lucide-react";

export function GalleryClient({
  categories,
  images
}: {
  categories: Array<{ id: string; name: string; slug: string }>;
  images: Array<{
    id: string;
    title: string;
    description?: string | null;
    url: string;
    location?: string | null;
    category: { name: string; slug: string };
  }>;
}) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [lightboxImage, setLightboxImage] = useState<(typeof images)[0] | null>(
    null
  );

  const filtered =
    selectedCategory === "ALL"
      ? images
      : images.filter((img) => img.category.slug === selectedCategory);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
        <button
          type="button"
          onClick={() => setSelectedCategory("ALL")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
            selectedCategory === "ALL"
              ? "bg-brand-forest text-white shadow-sm"
              : "bg-white text-brand-dark border border-brand-forest/15 hover:border-brand-forest"
          }`}
        >
          All Highland Photos ({images.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              selectedCategory === cat.slug
                ? "bg-brand-forest text-white shadow-sm"
                : "bg-white text-brand-dark border border-brand-forest/15 hover:border-brand-forest"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((img) => (
          <div
            key={img.id}
            onClick={() => setLightboxImage(img)}
            className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-brand-forest/10 shadow-card hover:shadow-premium transition-all"
          >
            <div className="relative h-64 overflow-hidden bg-brand-deep">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/85 via-transparent to-transparent" />
              <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Maximize2 className="w-4 h-4" />
              </div>
              <span className="absolute top-3.5 left-3.5 bg-brand-gold text-brand-deep text-[11px] font-extrabold px-3 py-1 rounded-full">
                {img.category.name}
              </span>
              {img.location && (
                <span className="absolute bottom-3 left-3.5 flex items-center gap-1 text-xs text-brand-cream/90 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                  {img.location}
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-serif text-lg font-bold text-brand-dark">
                {img.title}
              </h3>
              {img.description && (
                <p className="text-xs text-brand-dark/70 mt-1 line-clamp-2">
                  {img.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-brand-deep text-white rounded-3xl overflow-hidden max-w-4xl w-full border border-white/15 shadow-2xl"
          >
            <div className="relative max-h-[70vh] overflow-hidden bg-black">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="w-full h-full max-h-[70vh] object-contain mx-auto"
              />
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                  {lightboxImage.category.name} • {lightboxImage.location}
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1">
                  {lightboxImage.title}
                </h3>
                {lightboxImage.description && (
                  <p className="text-sm text-brand-cream/80 mt-1">
                    {lightboxImage.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

