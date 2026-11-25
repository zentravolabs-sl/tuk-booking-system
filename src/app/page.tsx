import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DestinationCard, TourPackageCard } from "@/components/tourism/Cards";
import {
  OfferCard,
  ReviewCard,
  FAQAccordion
} from "@/components/tourism/InteractiveWidgets";
import { QuickBookingWidget } from "@/components/tourism/QuickBookingWidget";
import {
  ShieldCheck,
  Award,
  BadgeDollarSign,
  Compass,
  Headphones,
  ArrowRight,
  Sparkles,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  Camera,
  Star,
  Mountain,
  HeartHandshake
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();

  const [
    settings,
    popularDestinations,
    featuredPackages,
    activeOffers,
    approvedReviews,
    galleryPhotos
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.destination.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: [{ popular: "desc" }, { featured: "desc" }, { createdAt: "asc" }],
      take: 6
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
      take: 3
    }),
    prisma.customerReview.findMany({
      where: { status: "APPROVED" },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 4
    }),
    prisma.galleryImage.findMany({
      where: { visible: true },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      take: 6
    })
  ]);

  const faqs = Array.isArray(settings?.faqs)
    ? (settings?.faqs as Array<{ question: string; answer: string }>)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar phone={settings?.phone} />

      {/* 1. HERO SECTION */}
      <section className="relative bg-brand-deep text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={
              settings?.heroBackgroundImage ||
              "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2000&q=85"
            }
            alt="Nine Arch Bridge & Ella Highland Tuk Tuk Adventure"
            className="w-full h-full object-cover opacity-45 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/80 via-brand-deep/65 to-brand-deep" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 lg:pt-20 lg:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-brand-gold/40 text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>#1 Rated Local Tuk Tuk Safari & Taxi Service in Ella</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
              {settings?.heroHeadline || "Explore Ella. Experience More."}
            </h1>

            <p className="mt-5 text-base sm:text-lg lg:text-xl text-brand-cream/90 leading-relaxed max-w-2xl mx-auto">
              {settings?.heroSubheadline ||
                "Discover breathtaking views, hidden waterfalls and unforgettable adventures with our trusted local Tuk Tuk service."}
            </p>

            {/* Primary Hero Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/destinations"
                className="px-7 py-4 rounded-full bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span>Explore Destinations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/book"
                className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/25 font-bold text-sm transition-all flex items-center gap-2"
              >
                <span>Book Your Adventure</span>
              </Link>
            </div>
          </div>

          {/* Quick Booking Widget */}
          <div className="mt-12">
            <QuickBookingWidget
              destinations={popularDestinations.map((d) => ({
                id: d.id,
                name: d.name,
                finalPrice: d.finalPrice
              }))}
            />
          </div>
        </div>
      </section>

      {/* 2. TRUST SECTION */}
      <section className="bg-brand-forest text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              {
                icon: Award,
                title: "Experienced Local Drivers",
                desc: "Born & raised in Ella hill country"
              },
              {
                icon: ShieldCheck,
                title: "Safe & Reliable Service",
                desc: "Well-maintained & insured fleet"
              },
              {
                icon: BadgeDollarSign,
                title: "Transparent Pricing",
                desc: "Zero hidden charges or haggling"
              },
              {
                icon: Compass,
                title: "Personalized Tours",
                desc: "Stop anywhere for scenic photos"
              },
              {
                icon: Headphones,
                title: "24/7 Customer Support",
                desc: "Sunrise & late train pickups"
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-white/5 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-cream/75 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. POPULAR DESTINATIONS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-forest bg-brand-forest/10 px-3.5 py-1.5 rounded-full">
              Iconic Highland Rides
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-3">
              Popular Destinations in Ella
            </h2>
            <p className="text-sm sm:text-base text-brand-dark/70 mt-2 max-w-2xl">
              From the world-famous Nine Arch Bridge to the 220m natural infinity pools of
              Upper Diyaluma Falls—ride directly to every viewpoint with a local expert.
            </p>
          </div>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-forest hover:text-brand-deep bg-white px-5 py-3 rounded-full border border-brand-forest/20 shadow-sm transition self-start md:self-auto"
          >
            <span>View All 9+ Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {popularDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED TOUR PACKAGES */}
      <section className="py-20 bg-white border-y border-brand-forest/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-deep bg-brand-gold/30 px-3.5 py-1.5 rounded-full">
                All-In-One Tuk Tuk Safaris
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-3">
                Curated Ella Tour Packages
              </h2>
              <p className="text-sm sm:text-base text-brand-dark/70 mt-2 max-w-2xl">
                Save time and money with our multi-stop highland circuits crafted around
                sunrise viewpoints, mountain train schedules, and waterfall swims.
              </p>
            </div>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-forest hover:text-brand-deep bg-brand-cream px-5 py-3 rounded-full border border-brand-forest/20 transition self-start md:self-auto"
            >
              <span>Explore All Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <TourPackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. SPECIAL OFFERS */}
      {activeOffers.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-forest bg-brand-forest/10 px-3.5 py-1.5 rounded-full">
                Exclusive Promotions & Coupons
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-3">
                Special Highland Offers
              </h2>
              <p className="text-sm sm:text-base text-brand-dark/70 mt-2">
                Copy any active coupon code below and apply it in our booking engine for
                instant verified savings.
              </p>
            </div>
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-forest hover:underline"
            >
              <span>See All Offers & Terms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {activeOffers.slice(0, 2).map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {/* 6. WHY CHOOSE US */}
      <section className="py-20 bg-brand-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-gold bg-white/10 px-3.5 py-1.5 rounded-full">
              The Authentic Ella Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
              Why Travelers Love Exploring Ella With Us
            </h2>
            <p className="text-sm sm:text-base text-brand-cream/80 mt-3">
              Unlike ride-hailing apps or street touts, our driver-guides are licensed
              local storytellers who know the exact railway timetables, hidden forest
              shortcuts, and safest mountain routes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Mountain,
                title: "Secret Viewpoint Shortcuts",
                desc: "We drive you along the upper forest ridge right to the Nine Arch Bridge viewpoint and Upper Diyaluma trailhead—saving hours of steep road walking."
              },
              {
                icon: BadgeDollarSign,
                title: "Fixed & Fair USD / LKR Rates",
                desc: "See the exact price before you book. No street haggling, no surprise waiting charges, and pay your driver only after your trip."
              },
              {
                icon: Camera,
                title: "Train-Timed Photography",
                desc: "Our drivers synchronize your ride with the live Kandy-Badulla blue mountain train crossings so you never miss the shot."
              },
              {
                icon: HeartHandshake,
                title: "100% Community-Owned",
                desc: "Every booking directly supports local Ella families and owner-drivers with fair wages and sustainable highland tourism."
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-brand-forest/45 border border-white/10 rounded-3xl p-7 hover:border-brand-gold/50 transition"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-deep flex items-center justify-center mb-5 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-2.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-brand-cream/80 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. HOW BOOKING WORKS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-forest bg-brand-forest/10 px-3.5 py-1.5 rounded-full">
            Effortless 60-Second Reservation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-3">
            How Booking Works
          </h2>
          <p className="text-sm sm:text-base text-brand-dark/70 mt-2">
            Reserve your private Tuk Tuk or highland tour from your phone in four simple
            steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              icon: MapPin,
              title: "Choose Your Destination",
              desc: "Pick any Ella landmark, multi-stop tour package, airport transfer, or custom charter."
            },
            {
              step: "02",
              icon: CalendarCheck,
              title: "Select Date & Pickup",
              desc: "Choose your preferred sunrise or daytime slot and enter your Ella hotel or railway station."
            },
            {
              step: "03",
              icon: Sparkles,
              title: "Submit Your Booking",
              desc: "Apply any promo code, review your transparent server-verified price breakdown, and confirm."
            },
            {
              step: "04",
              icon: CheckCircle2,
              title: "Receive Confirmation",
              desc: "Get an instant booking reference (ELLA-YYYY-XXXXXX) via email and track your driver live."
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-brand-forest/10 shadow-card relative overflow-hidden"
              >
                <span className="font-serif text-5xl font-black text-brand-forest/10 absolute top-4 right-5">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-brand-forest text-brand-gold flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-brand-dark/75 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="py-20 bg-white border-y border-brand-forest/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-forest bg-brand-forest/10 px-3.5 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                <span>4.98 / 5.0 Verified Guest Rating</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-3">
                Stories from Happy Travelers
              </h2>
              <p className="text-sm sm:text-base text-brand-dark/70 mt-2">
                Read verified reviews from international guests who explored Ella with our
                drivers.
              </p>
            </div>
            <Link
              href="/about#reviews"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-forest hover:underline"
            >
              <span>Share Your Review</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. GALLERY PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-forest bg-brand-forest/10 px-3.5 py-1.5 rounded-full">
              Captured in the Uva Highlands
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-3">
              Moments from Our Tuk Tuk Adventures
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-forest hover:text-brand-deep bg-white px-5 py-3 rounded-full border border-brand-forest/20 shadow-sm transition self-start md:self-auto"
          >
            <span>Open Full Photo Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleryPhotos.map((photo) => (
            <Link
              key={photo.id}
              href="/gallery"
              className="group relative h-64 rounded-3xl overflow-hidden bg-brand-deep shadow-card"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/85 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold">
                  {photo.category.name}
                </span>
                <h3 className="font-serif text-lg font-bold text-white leading-snug">
                  {photo.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      {faqs.length > 0 && (
        <section className="py-20 bg-white border-t border-brand-forest/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-forest bg-brand-forest/10 px-3.5 py-1.5 rounded-full">
                Traveler Questions Answered
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-3">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base text-brand-dark/70 mt-2">
                Everything you need to know about riding by Tuk Tuk in Ella, Sri Lanka.
              </p>
            </div>

            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* 11. BOTTOM CONVERSION BANNER */}
      <section className="py-16 bg-brand-forest text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Ready to Explore Ella&apos;s Misty Mountains & Waterfalls?
          </h2>
          <p className="text-brand-cream/85 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            Book online in under 60 seconds with instant confirmation, or chat with our
            local Ella dispatch desk on WhatsApp anytime.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book"
              className="px-8 py-4 rounded-full bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-extrabold text-sm shadow-lg transition flex items-center gap-2"
            >
              <span>Book Your Tuk Tuk Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/25 transition"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}

