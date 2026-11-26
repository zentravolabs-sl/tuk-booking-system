import React from "react";
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl p-10 border border-brand-forest/15 shadow-premium max-w-lg">
        <div className="w-14 h-14 rounded-2xl bg-brand-forest text-brand-gold flex items-center justify-center mx-auto mb-4">
          <Compass className="w-7 h-7" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-forest">
          404 • Page Not Found
        </span>
        <h1 className="font-serif text-3xl font-bold text-brand-dark mt-2">
          Lost in the Misty Tea Hills?
        </h1>
        <p className="text-sm text-brand-dark/70 mt-2">
          The page you are looking for doesn&apos;t exist, but our Ella Tuk Tuk drivers
          know the way back!
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-brand-forest text-white text-xs font-bold flex items-center gap-1.5"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
          </Link>
          <Link
            href="/tours"
            className="px-6 py-3 rounded-full bg-brand-gold text-brand-deep text-xs font-extrabold"
          >
            Explore Tour Packages
          </Link>
        </div>
      </div>
    </div>
  );
}

