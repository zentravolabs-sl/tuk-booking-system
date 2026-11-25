import React from "react";
import { Compass } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-brand-forest text-brand-gold flex items-center justify-center animate-pulse shadow-md mb-4">
        <Compass className="w-7 h-7 animate-spin" />
      </div>
      <p className="font-serif text-lg font-bold text-brand-dark">
        Loading Ella Highland Experiences...
      </p>
      <p className="text-xs text-brand-dark/60 mt-1">
        Ella Tuk Tuk Taxi Service • Sri Lanka
      </p>
    </div>
  );
}

