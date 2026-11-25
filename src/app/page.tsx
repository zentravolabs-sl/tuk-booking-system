import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  PopularDestinationOverlayCard,
  TourPackageCard
} from "@/components/tourism/Cards";
import { QuickBookingWidget } from "@/components/tourism/QuickBookingWidget";
import { HeroCarousel } from "@/components/tourism/HeroCarousel";
import {
  ShieldCheck,
  Headphones,
  Tag,
  Leaf,
  ArrowRight,
  Award,
  Users,
  MapPin,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();

  const [
    settings,
    popularDestinations,
    featuredPackages,
    activeOffers,
    approvedReviews
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.destination.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: [{ popular: "desc" }, { featured: "desc" }, { createdAt: "asc" }],
      take: 8
    }),
    prisma.tourPackage.findMany({
      where: { active: true },
      include: {
        destinations: {
          include: { destination: { select: { name: true, slug: true } } },
          orderBy: { stopOrder: "asc" }
        }
      },
      orderBy: [{ featured: "desc" }, { popular: "desc" }],
      take: 3
    }),
    prisma.offer.findMany({
      where: {
        active: true,
        endDate: { gte: now }
      },
      orderBy: { createdAt: "desc" },
      take: 1
    }),
    prisma.customerReview.findMany({
      where: { status: "APPROVED" },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 3
    })
  ]);

  const topOffer = activeOffers[0];
  const badgeLabels = ["Most Popular", "Best Value", "Nature & Waterfall"];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8ED]">
      <Navbar phone={settings?.phone} />

      {/* 1. CINEMATIC HERO SECTION (Matching Uploaded Design) */}
      <HeroCarousel />

      {/* 2. FLOATING PILL SEARCH BAR */}
      <div className="relative z-20 -mt-11 px-4 sm:px-6 lg:px-8">
        <QuickBookingWidget
          destinations={popularDestinations.map((d) => ({
            id: d.id,
            name: d.name,
            finalPrice: d.finalPrice
          }))}
        />
      </div>

      {/* 3. 4-ITEM TRUST STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white/70 rounded-2xl p-5 border border-[#164B35]/10">
          {[
            {
              icon: ShieldCheck,
              title: "Trusted Travel Partner",
              desc: "1000+ Happy Travelers"
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              desc: "Always Here for You"
            },
            {
              icon: Tag,
              title: "Best Price Guarantee",
              desc: "No Hidden Charges"
            },
            {
              icon: Leaf,
              title: "Local Experiences",
              desc: "Authentic & Unique"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 px-2"
              >
                <div className="w-10 h-10 rounded-full bg-[#164B35]/10 text-[#164B35] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#202820]">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. EXPLORE: POPULAR DESTINATIONS (4 Portrait Overlay Cards) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#164B35]">
              EXPLORE
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#202820] mt-1">
              Popular Destinations
            </h2>
          </div>
          <Link
            href="/destinations"
            className="text-xs sm:text-sm font-bold text-[#202820] hover:text-[#164B35] flex items-center gap-1.5"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularDestinations.slice(0, 4).map((dest) => (
            <PopularDestinationOverlayCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* 5. HANDPICKED: OUR TOUR PACKAGES (3 Cards) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#164B35]">
              HANDPICKED
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#202820] mt-1">
              Our Tour Packages
            </h2>
          </div>
          <Link
            href="/tours"
            className="text-xs sm:text-sm font-bold text-[#202820] hover:text-[#164B35] flex items-center gap-1.5"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPackages.map((pkg, idx) => (
            <TourPackageCard
              key={pkg.id}
              pkg={pkg}
              badgeLabel={badgeLabels[idx]}
            />
          ))}
        </div>
      </section>

      {/* 6. SPECIAL OFFER PANORAMIC BANNER */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-[#0B3024] text-white shadow-premium min-h-[270px] flex items-center">
          <img
            src={
              topOffer?.image ||
              "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=85"
            }
            alt="Special Offer Ella Tea Hills"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B3024] via-[#0B3024]/80 to-transparent" />

          <div className="relative z-10 p-8 sm:p-12 max-w-xl">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/85">
              SPECIAL OFFER
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-2 leading-tight">
              Up to{" "}
              <span className="text-[#E8B44C]">
                {topOffer ? `${topOffer.discountValue}% Off` : "20% Off"}
              </span>{" "}
              <br />
              on Ella Tour Packages
            </h2>
            <p className="text-xs sm:text-sm text-white/85 mt-3 leading-relaxed">
              {topOffer?.description ||
                "Book your next adventure today and save more on selected highland packages!"}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={
                  topOffer?.couponCode
                    ? `/book?coupon=${encodeURIComponent(topOffer.couponCode)}`
                    : "/book"
                }
                className="px-6 py-3 rounded-full bg-[#E8B44C] hover:bg-[#f3c15a] text-[#0B3024] font-extrabold text-xs sm:text-sm shadow-md transition inline-flex items-center gap-2"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/offers"
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
              >
                View Promo Codes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE US: EXPERIENCE TRAVEL WITH CONFIDENCE + 4 STATS */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white/80 rounded-3xl p-8 sm:p-10 border border-[#164B35]/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-sm">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#164B35]">
              WHY CHOOSE US
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202820] mt-1 leading-snug">
              Experience Travel with Confidence
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-10 w-full lg:w-auto">
            {[
              { icon: Award, value: "5+", label: "Years of Experience" },
              { icon: Users, value: "10K+", label: "Happy Travelers" },
              { icon: MapPin, value: "50+", label: "Tour Packages" },
              { icon: Star, value: "4.9/5", label: "Customer Rating" }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="text-center sm:border-l first:border-l-0 border-gray-200 sm:pl-6 first:pl-0"
                >
                  <Icon className="w-6 h-6 text-[#164B35] mx-auto mb-2" />
                  <span className="block font-serif text-2xl sm:text-3xl font-black text-[#202820]">
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS: WHAT OUR TRAVELERS SAY (3 Cards matching mockup) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#164B35]">
              TESTIMONIALS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#202820] mt-1">
              What Our Travelers Say
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/about#reviews"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#164B35] hover:text-white transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/about#reviews"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#164B35] hover:text-white transition"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#164B35] text-[#E8B44C] font-bold flex items-center justify-center text-sm shrink-0">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#202820]">
                      {rev.customerName}
                    </h4>
                    <div className="flex items-center gap-0.5 text-[#E8B44C] mt-0.5">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 fill-[#E8B44C] text-[#E8B44C]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>{rev.country}</span>
                <span>{rev.tourTitle || "Verified Guest"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TRAVEL BLOG / TIPS & STORIES (3 Cards matching mockup) */}
      <section className="py-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#164B35]">
              TRAVEL BLOG
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#202820] mt-1">
              Travel Tips &amp; Stories
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs sm:text-sm font-bold text-[#202820] hover:text-[#164B35] flex items-center gap-1.5"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              tag: "Travel Guide",
              title: "A Complete Guide to Visiting Ella in 2026",
              date: "Nov 18, 2026",
              image:
                "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1000&q=80",
              href: "/destinations/nine-arch-bridge"
            },
            {
              tag: "Travel Tips",
              title: "Top 10 Things to Do in Ella by Tuk Tuk",
              date: "Nov 10, 2026",
              image:
                "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=80",
              href: "/destinations/little-adams-peak"
            },
            {
              tag: "Destinations",
              title: "Ravana & Diyaluma Falls – A Must Visit in Ella",
              date: "Nov 05, 2026",
              image:
                "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1000&q=80",
              href: "/destinations/ravana-falls"
            }
          ].map((post, idx) => (
            <Link
              key={idx}
              href={post.href}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-card hover:shadow-premium transition-all flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-[#0B3024]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute bottom-3 left-3.5 bg-white/95 text-[#164B35] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                  {post.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-[#202820] group-hover:text-[#164B35] transition-colors leading-snug">
                  {post.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
