"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mountain,
  Menu,
  X,
  Phone,
  Search,
  Heart,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/tours", label: "Tours" },
  { href: "/offers", label: "Offers" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" }
];

export function Navbar({ phone = "0785089432" }: { phone?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B3024]/95 backdrop-blur-md shadow-premium py-3"
          : "bg-[#0B3024] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo matching mockup */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#164B35] border border-[#E8B44C]/40 flex items-center justify-center text-[#E8B44C] shadow-sm group-hover:scale-105 transition-transform">
            <Mountain className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-none">
              Kavith <span className="text-[#E8B44C]">Tuk Tuk</span>
            </span>
            <span className="block text-[9px] uppercase tracking-[0.24em] text-brand-cream/75 font-semibold mt-0.5">
              ELLA • SRI LANKA
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-all ${
                  active
                    ? "text-[#E8B44C] font-semibold"
                    : "text-white/90 hover:text-[#E8B44C]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Icons & Gold Book Now Button */}
        <div className="hidden md:flex items-center gap-3.5">
          <Link
            href="/track-booking"
            title="Track My Booking"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <Search className="w-4 h-4" />
          </Link>
          <Link
            href="/offers"
            title="Special Offers"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <Heart className="w-4 h-4" />
          </Link>
          <Link
            href="/book"
            className="bg-[#E8B44C] hover:bg-[#f3c15a] text-[#0B3024] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
          className="lg:hidden p-2.5 rounded-xl bg-[#164B35] text-white hover:text-[#E8B44C] transition"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0B3024] border-t border-white/10 px-4 pt-4 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between ${
                    active
                      ? "bg-[#164B35] text-[#E8B44C] font-semibold"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </Link>
              );
            })}
            <Link
              href="/track-booking"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-[#E8B44C] hover:bg-white/5 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Track My Booking
              </span>
              <ArrowRight className="w-4 h-4 opacity-60" />
            </Link>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <Link
              href="/book"
              onClick={() => setMobileOpen(false)}
              className="w-full bg-[#E8B44C] text-[#0B3024] font-extrabold py-3 rounded-full text-center shadow-md text-sm"
            >
              Book Now
            </Link>
            <div className="flex items-center justify-between text-xs text-white/80 px-2 pt-1">
              <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:text-[#E8B44C]">
                <Phone className="w-3.5 h-3.5 text-[#E8B44C]" />
                {phone}
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1 hover:text-[#E8B44C]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8B44C]" />
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
