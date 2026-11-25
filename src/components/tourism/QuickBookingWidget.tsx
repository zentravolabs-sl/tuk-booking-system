"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, ArrowRight, Sparkles } from "lucide-react";

export function QuickBookingWidget({
  destinations
}: {
  destinations: Array<{ id: string; name: string; finalPrice: number }>;
}) {
  const router = useRouter();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [destinationId, setDestinationId] = useState(destinations[0]?.id || "");
  const [date, setDate] = useState(tomorrow);
  const [passengers, setPassengers] = useState("2");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destinationId) {
      params.set("type", "DESTINATION_RIDE");
      params.set("destinationId", destinationId);
    }
    if (date) params.set("date", date);
    if (passengers) params.set("passengers", passengers);
    router.push(`/book?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-premium border border-brand-gold/40 max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-forest mb-3 px-1">
        <Sparkles className="w-4 h-4 text-brand-gold" />
        <span>Instant Online Tuk Tuk & Tour Reservation — No Advance Deposit Required</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 items-end">
        {/* Destination Select */}
        <div className="bg-brand-cream/70 rounded-2xl p-3 border border-brand-forest/15">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-forest mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-gold" />
            Destination / Ride
          </label>
          <select
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-brand-dark focus:outline-none"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} (${d.finalPrice})
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div className="bg-brand-cream/70 rounded-2xl p-3 border border-brand-forest/15">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-forest mb-1">
            <Calendar className="w-3.5 h-3.5 text-brand-gold" />
            Pickup Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-brand-dark focus:outline-none"
            required
          />
        </div>

        {/* Passengers */}
        <div className="bg-brand-cream/70 rounded-2xl p-3 border border-brand-forest/15">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-forest mb-1">
            <Users className="w-3.5 h-3.5 text-brand-gold" />
            Passengers
          </label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-brand-dark focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Passenger" : "Passengers"}{" "}
                {num > 3 ? `(${Math.ceil(num / 3)} Tuk Tuks)` : "(1 Tuk Tuk)"}
              </option>
            ))}
          </select>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="h-full min-h-[58px] bg-brand-forest hover:bg-brand-deep text-white font-bold text-sm rounded-2xl px-6 py-3.5 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>Search & Book</span>
          <ArrowRight className="w-4 h-4 text-brand-gold" />
        </button>
      </div>
    </form>
  );
}

