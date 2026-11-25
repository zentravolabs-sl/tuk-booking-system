import React from "react";
import Link from "next/link";
import {
  Mountain,
  Phone,
  Mail,
  MapPin,
  Send,
  ShieldCheck
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
  const address = settings?.address || "Ella, Sri Lanka";

  return (
    <footer className="bg-[#0B3024] text-white mt-auto">
      {/* Top Newsletter Banner matching mockup */}
      <div className="bg-[#164B35] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8B44C]/20 border border-[#E8B44C]/40 flex items-center justify-center text-[#E8B44C] shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Get Travel Deals & Updates
              </h3>
              <p className="text-xs sm:text-sm text-white/75 mt-0.5">
                Subscribe to our newsletter and be the first to know about new tours,
                special offers and travel tips.
              </p>
            </div>
          </div>

          <form
            action="/contact"
            className="w-full md:w-auto flex items-center bg-white rounded-full p-1.5 pl-4 shadow-md min-w-[300px] sm:min-w-[360px]"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-transparent text-xs sm:text-sm text-[#202820] focus:outline-none"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#E8B44C] hover:bg-[#f3c15a] text-[#0B3024] flex items-center justify-center shrink-0 transition"
              aria-label="Subscribe"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#164B35] border border-[#E8B44C]/40 flex items-center justify-center text-[#E8B44C]">
              <Mountain className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <span className="block font-serif text-xl font-bold text-white leading-none">
                Kavith <span className="text-[#E8B44C]">Tuk Tuk</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[0.22em] text-white/70 font-semibold mt-0.5">
                ELLA • SRI LANKA
              </span>
            </div>
          </Link>
          <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
            Explore Sri Lanka with trusted tour packages, local experiences and
            unforgettable journeys across Ella&apos;s misty mountains and waterfalls.
          </p>
          <div className="flex items-center gap-2.5 pt-1">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#E8B44C] hover:text-[#0B3024] text-xs font-semibold transition"
            >
              WhatsApp
            </a>
            {settings?.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#E8B44C] hover:text-[#0B3024] text-xs font-semibold transition"
              >
                Facebook
              </a>
            )}
            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#E8B44C] hover:text-[#0B3024] text-xs font-semibold transition"
              >
                Instagram
              </a>
            )}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-white/75">
            <li>
              <Link href="/" className="hover:text-[#E8B44C] transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/destinations" className="hover:text-[#E8B44C] transition">
                Destinations
              </Link>
            </li>
            <li>
              <Link href="/tours" className="hover:text-[#E8B44C] transition">
                Tours
              </Link>
            </li>
            <li>
              <Link href="/offers" className="hover:text-[#E8B44C] transition">
                Offers
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#E8B44C] transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#E8B44C] transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Destinations */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Popular Destinations</h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-white/75">
            <li>
              <Link href="/destinations/nine-arch-bridge" className="hover:text-[#E8B44C] transition">
                Nine Arches Bridge
              </Link>
            </li>
            <li>
              <Link href="/destinations/ravana-falls" className="hover:text-[#E8B44C] transition">
                Ravana Falls
              </Link>
            </li>
            <li>
              <Link href="/destinations/little-adams-peak" className="hover:text-[#E8B44C] transition">
                Little Adam&apos;s Peak
              </Link>
            </li>
            <li>
              <Link href="/destinations/diyaluma-falls" className="hover:text-[#E8B44C] transition">
                Diyaluma Falls
              </Link>
            </li>
            <li>
              <Link href="/destinations/liptons-seat" className="hover:text-[#E8B44C] transition">
                Lipton&apos;s Seat
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Us */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Contact Us</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-white/80">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#E8B44C] shrink-0" />
              <a href={`tel:${phone}`} className="hover:text-[#E8B44C]">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#E8B44C] shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-[#E8B44C] break-all">
                {email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#E8B44C] shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} {settings?.businessName || "Kavith Tuk Tuk Service"}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/contact" className="hover:text-[#E8B44C]">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-[#E8B44C]">
              Terms & Conditions
            </Link>
            <Link
              href="/admin"
              className="text-[#E8B44C] hover:underline font-semibold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
