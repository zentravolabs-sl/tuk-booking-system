import React from "react";
import Link from "next/link";
import {
  Compass,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Clock,
  Award,
  ArrowUpRight
} from "lucide-react";

export function Footer({
  settings
}: {
  settings?: {
    businessName?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    tripadvisorUrl?: string | null;
  } | null;
}) {
  const phone = settings?.phone || "0785089432";
  const whatsapp = (settings?.whatsapp || "+94785089432").replace(/[^0-9]/g, "");
  const email = settings?.email || "Kavithsasalanka@gmail.com";
  const address =
    settings?.address || "Main Street, Near Railway Station, Ella 90090, Sri Lanka";

  return (
    <footer className="bg-brand-deep text-brand-cream border-t border-white/10 mt-auto">
      {/* Upper Highlight Bar */}
      <div className="border-b border-white/10 bg-brand-forest/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">24/7 Highland Dispatch</p>
              <p className="text-xs text-brand-cream/75">
                5:00 AM Sunrise Rides & Late Train Pickups
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">100% Local Ella Drivers</p>
              <p className="text-xs text-brand-cream/75">
                English-Speaking, Insured & Community Owned
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Instant WhatsApp Support</p>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-gold hover:underline flex items-center gap-1"
              >
                Chat directly with our Ella desk <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center text-brand-deep">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="block font-serif text-xl font-bold text-white leading-none">
                Kavith Tuk Tuk
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-brand-gold font-semibold mt-1">
                Service • Ella Sri Lanka
              </span>
            </div>
          </Link>
          <p className="text-sm text-brand-cream/80 leading-relaxed">
            Discover breathtaking mountain views, colonial railway bridges, hidden waterfalls,
            and emerald tea estates with Ella&apos;s most trusted local Tuk Tuk fleet.
          </p>
          <div className="flex items-center gap-2.5 pt-2">
            {settings?.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-brand-gold hover:text-brand-deep text-xs font-semibold transition"
              >
                Facebook
              </a>
            )}
            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-brand-gold hover:text-brand-deep text-xs font-semibold transition"
              >
                Instagram
              </a>
            )}
            {settings?.tripadvisorUrl && (
              <a
                href={settings.tripadvisorUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-brand-gold hover:text-brand-deep text-xs font-semibold transition"
              >
                TripAdvisor
              </a>
            )}
          </div>
        </div>

        {/* Col 2: Quick Navigation */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold mb-4">
            Explore & Book
          </h3>
          <ul className="space-y-2.5 text-sm text-brand-cream/80">
            <li>
              <Link href="/destinations" className="hover:text-brand-gold transition">
                All Ella Destinations
              </Link>
            </li>
            <li>
              <Link href="/tours" className="hover:text-brand-gold transition">
                Curated Tour Packages
              </Link>
            </li>
            <li>
              <Link href="/offers" className="hover:text-brand-gold transition">
                Special Offers & Coupons
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-brand-gold transition">
                Online Booking Engine
              </Link>
            </li>
            <li>
              <Link href="/track-booking" className="hover:text-brand-gold transition">
                Track Existing Booking
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-brand-gold transition">
                Traveler Photo Gallery
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Destinations */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold mb-4">
            Top Highland Stops
          </h3>
          <ul className="space-y-2.5 text-sm text-brand-cream/80">
            <li>
              <Link href="/destinations/nine-arch-bridge" className="hover:text-brand-gold transition">
                Nine Arch Bridge Train Tour
              </Link>
            </li>
            <li>
              <Link href="/destinations/little-adams-peak" className="hover:text-brand-gold transition">
                Little Adam&apos;s Peak Sunrise
              </Link>
            </li>
            <li>
              <Link href="/destinations/diyaluma-falls" className="hover:text-brand-gold transition">
                Upper Diyaluma Infinity Pools
              </Link>
            </li>
            <li>
              <Link href="/destinations/liptons-seat" className="hover:text-brand-gold transition">
                Lipton&apos;s Seat & Dambatenne
              </Link>
            </li>
            <li>
              <Link href="/destinations/ella-rock" className="hover:text-brand-gold transition">
                Ella Rock Trailhead Transfer
              </Link>
            </li>
            <li>
              <Link href="/destinations/halpe-tea-factory" className="hover:text-brand-gold transition">
                Uva Halpe Tea Factory Tour
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Info */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold mb-4">
            Contact Our Ella Desk
          </h3>
          <ul className="space-y-3.5 text-sm text-brand-cream/85">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-1" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-gold shrink-0" />
              <a href={`tel:${phone}`} className="hover:text-brand-gold">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-brand-gold shrink-0" />
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-gold"
              >
                WhatsApp: {phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-gold shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-brand-gold break-all">
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Admin Link */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-cream/65">
          <p>
            © {new Date().getFullYear()} {settings?.businessName || "Kavith Tuk Tuk Service"}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/about" className="hover:text-brand-gold transition">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-brand-gold transition">
              Privacy & Terms
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-brand-gold hover:underline font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

