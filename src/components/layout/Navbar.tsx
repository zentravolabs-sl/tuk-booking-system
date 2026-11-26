"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getCustomerSessionStatusAction,
  customerLogoutAction
} from "@/app/actions/customer-auth-actions";
import {
  Mountain,
  Menu,
  X,
  Phone,
  Search,
  ShieldCheck,
  ArrowRight,
  User,
  LogOut,
  CheckCircle2
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/offers", label: "Offers" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" }
];

export function Navbar({
  phone = "0785089432",
  initialCustomer = null
}: {
  phone?: string;
  initialCustomer?: { id: string; fullName: string; email: string } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customer, setCustomer] = useState<{
    id: string;
    fullName: string;
    email: string;
  } | null>(initialCustomer);
  const [authChecked, setAuthChecked] = useState(Boolean(initialCustomer));
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let active = true;
    getCustomerSessionStatusAction()
      .then((res) => {
        if (!active) return;
        setCustomer(res.loggedIn ? res.customer : null);
        setAuthChecked(true);
      })
      .catch(() => {
        if (active) setAuthChecked(true);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await customerLogoutAction();
      setCustomer(null);
      setMobileOpen(false);
      toast.success("Signed out of your customer account.");
      if (pathname?.startsWith("/dashboard")) {
        router.push("/login");
      }
      router.refresh();
    } catch {
      toast.error("Unable to sign out right now.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (pathname?.startsWith("/admin")) return null;

  const firstName = customer?.fullName?.split(" ")[0] || customer?.fullName || "Customer";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B3024]/95 backdrop-blur-md shadow-premium py-3"
          : "bg-[#0B3024] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
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
          {customer && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-all ${
                pathname?.startsWith("/dashboard")
                  ? "text-[#E8B44C] font-semibold"
                  : "text-white/90 hover:text-[#E8B44C]"
              }`}
            >
              My Bookings
            </Link>
          )}
        </nav>

        {/* Right Side: Logged-in Status OR Customer Login Button + Book Now */}
        <div className="hidden md:flex items-center gap-2.5">
          {customer ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                title={`Signed in as ${customer.fullName} (${customer.email})`}
                className="bg-[#164B35] hover:bg-[#1e6346] text-white border border-[#E8B44C]/40 px-3.5 py-2 rounded-full text-xs font-bold transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-white/75 font-medium hidden xl:inline">
                  Logged in:
                </span>
                <span className="text-[#E8B44C] font-extrabold max-w-[120px] truncate">
                  {firstName}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                title="Sign out of customer account"
                className="p-2 rounded-full bg-white/10 hover:bg-red-500/25 text-white/80 hover:text-white border border-white/15 transition"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            authChecked && (
              <Link
                href="/login"
                className="text-white/90 hover:text-[#E8B44C] border border-white/20 hover:border-[#E8B44C]/60 font-bold text-xs sm:text-sm px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#E8B44C]" />
                <span>Login</span>
              </Link>
            )
          )}
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
          {/* Mobile Logged-in Status Card */}
          {customer && (
            <div className="bg-[#164B35] border border-[#E8B44C]/35 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Logged In Customer</span>
                </div>
                <p className="text-sm font-bold text-white truncate mt-0.5">
                  {customer.fullName}
                </p>
                <p className="text-[11px] text-white/75 truncate font-mono">
                  {customer.email}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-red-500/25 text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 text-[#E8B44C]" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

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

            {customer ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-[#E8B44C] bg-[#164B35]/60 hover:bg-[#164B35] flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" /> My Customer Dashboard
                </span>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-[#E8B44C] hover:bg-white/5 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Login / Register
                </span>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </Link>
            )}

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
