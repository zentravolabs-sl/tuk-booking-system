import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DestinationCard } from "@/components/tourism/Cards";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Flame,
  RotateCcw,
  Compass
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ella Destinations & Scenic Tuk Tuk Rides | Nine Arch Bridge, Diyaluma & Peaks",
  description:
    "Explore all top destinations in Ella, Sri Lanka by private Tuk Tuk: Nine Arch Bridge, Little Adam's Peak, Upper Diyaluma Falls, Lipton's Seat, Ella Rock & more."
};

export default async function DestinationsPage({
  searchParams
}: {
  searchParams: {
    q?: string;
    category?: string;
    maxPrice?: string;
    popular?: string;
    featured?: string;
    sort?: string;
    page?: string;
  };
}) {
  const q = (searchParams.q || "").trim();
  const categorySlug = searchParams.category || "";
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const onlyPopular = searchParams.popular === "true";
  const onlyFeatured = searchParams.featured === "true";
  const sort = searchParams.sort || "popular";
  const currentPage = Math.max(1, Number(searchParams.page) || 1);
  const pageSize = 9;

  const whereClause: Record<string, unknown> = {
    active: true
  };

  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } }
    ];
  }

  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  if (maxPrice && !isNaN(maxPrice)) {
    whereClause.finalPrice = { lte: maxPrice };
  }

  if (onlyPopular) {
    whereClause.popular = true;
  }

  if (onlyFeatured) {
    whereClause.featured = true;
  }

  let orderBy: Record<string, unknown> | Array<Record<string, unknown>> = [
    { popular: "desc" },
    { featured: "desc" },
    { name: "asc" }
  ];

  if (sort === "price_asc") {
    orderBy = { finalPrice: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { finalPrice: "desc" };
  } else if (sort === "name_asc") {
    orderBy = { name: "asc" };
  }

  const [settings, categories, totalCount, destinations] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.destinationCategory.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" }
    }),
    prisma.destination.count({ where: whereClause }),
    prisma.destination.findMany({
      where: whereClause,
      include: { category: true },
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    })
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar phone={settings?.phone} />

      {/* Page Hero */}
      <section className="bg-brand-deep text-white py-14 sm:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-gold bg-white/10 px-3.5 py-1.5 rounded-full">
            <Compass className="w-3.5 h-3.5" />
            <span>Highland Landmarks, Peaks & Waterfalls</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-3">
            Explore Ella Destinations
          </h1>
          <p className="text-brand-cream/85 text-sm sm:text-base mt-3 max-w-2xl">
            Every ride includes private hotel or railway station pickup, scenic photo
            stops, and an experienced English-speaking local Ella driver.
          </p>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
        <form
          method="GET"
          action="/destinations"
          className="bg-white rounded-3xl p-5 sm:p-6 shadow-premium border border-brand-forest/15"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Box */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-forest mb-1">
                Search Destination
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-brand-forest/60 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Nine Arch Bridge, Diyaluma, Lipton's Seat..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/15 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-forest mb-1">
                Category
              </label>
              <select
                name="category"
                defaultValue={categorySlug}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/15 text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-forest"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-forest mb-1">
                Max Price (USD)
              </label>
              <select
                name="maxPrice"
                defaultValue={maxPrice ? String(maxPrice) : ""}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/15 text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-forest"
              >
                <option value="">Any Price</option>
                <option value="15">Under $15</option>
                <option value="25">Under $25</option>
                <option value="40">Under $40</option>
                <option value="60">Under $60</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-forest mb-1">
                Sort By
              </label>
              <select
                name="sort"
                defaultValue={sort}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/15 text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-forest"
              >
                <option value="popular">Most Popular First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Toggles & Action Buttons */}
          <div className="mt-4 pt-4 border-t border-brand-forest/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-brand-dark cursor-pointer">
                <input
                  type="checkbox"
                  name="popular"
                  value="true"
                  defaultChecked={onlyPopular}
                  className="rounded border-brand-forest text-brand-forest focus:ring-brand-forest"
                />
                <Flame className="w-3.5 h-3.5 text-brand-gold" />
                Popular Rides Only
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-brand-dark cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  value="true"
                  defaultChecked={onlyFeatured}
                  className="rounded border-brand-forest text-brand-forest focus:ring-brand-forest"
                />
                <Sparkles className="w-3.5 h-3.5 text-brand-forest" />
                Featured Highlights Only
              </label>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/destinations"
                className="px-4 py-2 rounded-xl border border-brand-forest/20 text-xs font-semibold text-brand-forest hover:bg-brand-forest/5 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Link>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-forest hover:bg-brand-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold" />
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/destinations"
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                !categorySlug
                  ? "bg-brand-forest text-white shadow-sm"
                  : "bg-white text-brand-dark border border-brand-forest/15 hover:border-brand-forest"
              }`}
            >
              All Destinations ({totalCount})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/destinations?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  categorySlug === cat.slug
                    ? "bg-brand-forest text-white shadow-sm"
                    : "bg-white text-brand-dark border border-brand-forest/15 hover:border-brand-forest"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Grid */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {destinations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-forest/15 shadow-card max-w-xl mx-auto my-8">
            <Compass className="w-12 h-12 text-brand-forest mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-2xl font-bold text-brand-dark">
              No Destinations Matched Your Filter
            </h3>
            <p className="text-sm text-brand-dark/70 mt-2">
              Try clearing your search filters or contact us for a custom Tuk Tuk route
              anywhere in Sri Lanka&apos;s hill country.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/destinations"
                className="px-5 py-2.5 rounded-full bg-brand-forest text-white text-xs font-bold"
              >
                Show All Destinations
              </Link>
              <Link
                href="/book?type=CUSTOM_TOUR"
                className="px-5 py-2.5 rounded-full bg-brand-gold text-brand-deep text-xs font-bold"
              >
                Book Custom Route
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {destinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const params = new URLSearchParams();
                  if (q) params.set("q", q);
                  if (categorySlug) params.set("category", categorySlug);
                  if (maxPrice) params.set("maxPrice", String(maxPrice));
                  if (onlyPopular) params.set("popular", "true");
                  if (onlyFeatured) params.set("featured", "true");
                  if (sort) params.set("sort", sort);
                  params.set("page", String(p));
                  return (
                    <Link
                      key={p}
                      href={`/destinations?${params.toString()}`}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                        p === currentPage
                          ? "bg-brand-forest text-white shadow-sm"
                          : "bg-white text-brand-dark border border-brand-forest/15 hover:bg-brand-forest/5"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      <Footer settings={settings} />
    </div>
  );
}

