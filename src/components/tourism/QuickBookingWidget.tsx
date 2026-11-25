"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, Search } from "lucide-react";

export function QuickBookingWidget({
  destinations
}: {
  destinations: Array<{ id: string; name: string; finalPrice: number }>;
}) {
  const router = useRouter();
  const [destinationId, setDestinationId] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");

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
      className="bg-white rounded-[32px] lg:rounded-full px-4 py-3.5 sm:px-7 sm:py-4 shadow-[0_20px_50px_rgba(11,48,36,0.18)] border border-gray-100 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* 1. Destination: Where to go? */}
        <div className="md:col-span-3 flex items-center gap-3.5 md:border-r border-gray-200 pr-2">
          <MapPin className="w-6 h-6 text-[#164B35] stroke-[1.8] shrink-0" />
          <div className="min-w-0 flex-1 text-left">
            <label className="block text-xs font-bold text-[#202820]">
              Destination
            </label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-gray-500 font-medium focus:outline-none truncate mt-0.5 cursor-pointer"
            >
              <option value="">Where to go?</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id} className="text-[#202820]">
                  {d.name} (${d.finalPrice})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Travel Date: Select date */}
        <div className="md:col-span-3 flex items-center gap-3.5 md:border-r border-gray-200 md:pl-3 pr-2">
          <Calendar className="w-6 h-6 text-[#164B35] stroke-[1.8] shrink-0" />
          <div className="min-w-0 flex-1 text-left">
            <label className="block text-xs font-bold text-[#202820]">
              Travel Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Select date"
              className="w-full bg-transparent text-xs sm:text-sm text-gray-500 font-medium focus:outline-none mt-0.5 cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Travelers: 1 Traveler */}
        <div className="md:col-span-3 flex items-center gap-3.5 md:pl-3">
          <Users className="w-6 h-6 text-[#164B35] stroke-[1.8] shrink-0" />
          <div className="min-w-0 flex-1 text-left">
            <label className="block text-xs font-bold text-[#202820]">
              Travelers
            </label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-gray-500 font-medium focus:outline-none mt-0.5 cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num} className="text-[#202820]">
                  {num} {num === 1 ? "Traveler" : "Travelers"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Search Tours Pill CTA */}
        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            className="w-full bg-[#164B35] hover:bg-[#0B3024] text-white font-bold text-sm rounded-full py-3.5 px-6 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-white" />
            <span>Search Tours</span>
          </button>
        </div>
      </div>
    </form>
  );
}
