"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-forest/15 shadow-premium max-w-md">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-brand-dark">
          Something Went Off-Trail
        </h2>
        <p className="text-xs sm:text-sm text-brand-dark/70 mt-2">
          {error.message || "We encountered a temporary issue loading this page."}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-brand-forest text-white text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-brand-forest/20 text-brand-forest text-xs font-bold"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

