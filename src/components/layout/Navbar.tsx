"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Menu,
  X,
  Phone,
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/tours", label: "Tours" },
  { href: "/offers", label: "Offers" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
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
          ? "bg-brand-deep/95 backdrop-blur-md shadow-premium py-3"
          : "bg-brand-deep py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-brand-gold flex items-center justify-center text-brand-deep shadow-md group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-none">
              Kavith Tuk Tuk
            </span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-brand-gold font-semibold mt-1">
              Service • Ella Sri Lanka
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-brand-forest text-brand-gold font-semibold"
                    : "text-brand-cream/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/track-booking"
            className="text-xs font-semibold text-brand-cream/90 hover:text-brand-gold px-3 py-2 rounded-full border border-white/15 hover:border-brand-gold/50 transition flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-brand-gold" />
            Track Booking
          </Link>
          <Link
            href="/book"
            className="bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-bold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
          className="lg:hidden p-2.5 rounded-xl bg-brand-forest text-brand-cream hover:text-brand-gold transition"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-deep border-t border-white/10 px-4 pt-4 pb-6 space-y-3">
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
                  className={`px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
                    active
                      ? "bg-brand-forest text-brand-gold font-semibold"
                      : "text-brand-cream hover:bg-white/5"
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
              className="px-4 py-3 rounded-xl text-base font-medium text-brand-gold hover:bg-white/5 flex items-center justify-between"
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
              className="w-full bg-brand-gold text-brand-deep font-bold py-3.5 rounded-xl text-center shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Book Your Tuk Tuk Adventure
            </Link>
            <div className="flex items-center justify-between text-xs text-brand-cream/80 px-2 pt-1">
              <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:text-brand-gold">
                <Phone className="w-3.5 h-3.5 text-brand-gold" />
                {phone}
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1 hover:text-brand-gold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

