"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { adminLoginAction } from "@/app/actions/admin-actions";
import { Compass, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ellatuktuktaxiservice.com");
  const [password, setPassword] = useState("Admin@Ella2026!");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLoginAction(email, password);
      if (!res.success) {
        toast.error(res.error || "Invalid credentials.");
      } else {
        toast.success(`Welcome back, ${res.user?.name}!`);
        router.push("/admin");
        router.refresh();
      }
    } catch {
      toast.error("Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-deep flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-brand-gold/30">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-forest text-brand-gold flex items-center justify-center mx-auto mb-4 shadow-md">
            <Compass className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-forest bg-brand-forest/10 px-3 py-1 rounded-full">
            Role-Based Staff Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-3">
            Ella Tuk Tuk Admin Login
          </h1>
          <p className="text-xs text-brand-dark/65 mt-1">
            Sign in to manage destinations, packages, offers, bookings, and website content.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-forest/60 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-cream/70 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-forest/60 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-cream/70 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-forest hover:bg-brand-deep text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Admin Dashboard"}</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-6 pt-5 border-t border-brand-forest/10 bg-brand-cream/60 rounded-2xl p-4 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-brand-forest">
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
            <span>Seeded Admin Credentials (Pre-filled):</span>
          </div>
          <p className="text-brand-dark/80 font-mono text-[11px]">
            Super Admin: admin@ellatuktuktaxiservice.com / Admin@Ella2026!
          </p>
          <p className="text-brand-dark/80 font-mono text-[11px]">
            Manager: manager@ellatuktuktaxiservice.com / Manager@Ella2026!
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-brand-forest hover:underline"
          >
            ← Return to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}

