"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitRideModalBookingAction } from "@/app/actions/booking-actions";
import { getCustomerSessionStatusAction } from "@/app/actions/customer-auth-actions";
import {
  MapPin,
  Clock,
  Tag,
  Calendar,
  Users,
  Mail,
  Phone,
  User,
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";

export interface RideItem {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  image: string;
  priceUsd: number;
  priceLkr: number;
  tag: string;
  distance?: string | null;
  travelTime?: string | null;
}

export interface BookingCustomerPrefill {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export function OurRidesSection({
  rides,
  initialCustomer = null
}: {
  rides: RideItem[];
  initialCustomer?: BookingCustomerPrefill | null;
}) {
  const router = useRouter();
  const [loggedCustomer, setLoggedCustomer] =
    useState<BookingCustomerPrefill | null>(initialCustomer);
  const [selectedRide, setSelectedRide] = useState<RideItem | null>(null);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [customerName, setCustomerName] = useState(
    initialCustomer?.fullName || ""
  );
  const [whatsappNumber, setWhatsappNumber] = useState(
    initialCustomer?.phone && initialCustomer.phone !== "Not provided"
      ? initialCustomer.phone
      : ""
  );
  const [customerEmail, setCustomerEmail] = useState(
    initialCustomer?.email || ""
  );
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("08:30 AM");
  const [passengers, setPassengers] = useState(2);

  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getCustomerSessionStatusAction()
      .then((res) => {
        if (!active || !res.loggedIn || !res.customer) return;
        setLoggedCustomer(res.customer);
        setCustomerName((prev) => prev || res.customer!.fullName || "");
        setCustomerEmail((prev) => prev || res.customer!.email || "");
        setWhatsappNumber((prev) => prev || res.customer!.phone || "");
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const openBookingModal = async (ride: RideItem) => {
    if (!loggedCustomer) {
      const session = await getCustomerSessionStatusAction().catch(() => null);
      if (!session?.loggedIn || !session.customer) {
        toast.error("Please log in to your account to book a ride.");
        router.push("/login");
        return;
      }
      setLoggedCustomer(session.customer);
      setCustomerName((prev) => prev || session.customer!.fullName || "");
      setCustomerEmail((prev) => prev || session.customer!.email || "");
      setWhatsappNumber(
        (prev) =>
          prev ||
          (session.customer!.phone && session.customer!.phone !== "Not provided"
            ? session.customer!.phone
            : "")
      );
    }

    setSelectedRide(ride);
    setSelectedDestination(ride.name);
    setBookingRef(null);
    if (loggedCustomer) {
      setCustomerName((prev) => prev || loggedCustomer.fullName || "");
      setCustomerEmail((prev) => prev || loggedCustomer.email || "");
      setWhatsappNumber(
        (prev) =>
          prev ||
          (loggedCustomer.phone && loggedCustomer.phone !== "Not provided"
            ? loggedCustomer.phone
            : "")
      );
    }
  };

  const closeModal = () => {
    setSelectedRide(null);
    setBookingRef(null);
  };

  const handleDestinationChange = (destName: string) => {
    setSelectedDestination(destName);
    const matchingRide = rides.find((r) => r.name === destName);
    if (matchingRide) {
      setSelectedRide(matchingRide);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedCustomer) {
      toast.error("Please log in to your account to place a ride booking.");
      router.push("/login");
      return;
    }

    if (!selectedDestination.trim()) {
      toast.error("Please select a destination.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitRideModalBookingAction({
        rideId: selectedRide?.id || null,
        selectedDestination,
        priceUsd: selectedRide?.priceUsd || 0,
        priceLkr: selectedRide?.priceLkr || 0,
        customerName,
        whatsappNumber,
        customerEmail,
        pickupDate,
        pickupTime,
        passengers: Number(passengers) || 1
      });

      if (!res.success) {
        toast.error(res.error || "Could not submit your booking.");
        if ((res as { requiresAuth?: boolean }).requiresAuth) {
          router.push("/login");
        }
      } else {
        setBookingRef(res.bookingReference || "CONFIRMED");
        toast.success("Booking sent via email! Our team will contact you shortly.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!rides || rides.length === 0) return null;

  return (
    <section
      id="our-rides"
      className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#164B35]">
            LOCAL TUK TUK TRANSFERS &amp; EXCURSIONS
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#202820] mt-1">
            Our Rides
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md">
          Transparent rates in USD &amp; Sri Lankan Rupees (Rs). Pick your ride and
          book directly with instant email notification.
        </p>
      </div>

      {/* Rides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="group bg-white rounded-3xl overflow-hidden border border-[#164B35]/12 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Card Image + Tag Badge */}
              <div className="relative h-56 w-full overflow-hidden bg-[#0B3024]">
                <img
                  src={ride.image}
                  alt={ride.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* Top Tag Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#E8B44C] text-[#0B3024] text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-sm">
                    <Tag className="w-3 h-3" />
                    {ride.tag}
                  </span>
                </div>

                {/* Bottom Route / Time overlay */}
                {(ride.distance || ride.travelTime) && (
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/90">
                    {ride.distance && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#E8B44C]" />
                        {ride.distance}
                      </span>
                    )}
                    {ride.travelTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#E8B44C]" />
                        {ride.travelTime}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Title & Description */}
              <div className="p-5 pb-3">
                <h3 className="font-serif text-xl font-bold text-[#202820] group-hover:text-[#164B35] transition-colors">
                  {ride.name}
                </h3>
                {ride.shortDescription && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {ride.shortDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Dual Pricing (USD & Rs) + Book a Ride Button */}
            <div className="p-5 pt-4 mt-2 border-t border-gray-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider block">
                  Ride Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
                  <span className="text-xl font-extrabold text-[#0B3024]">
                    ${ride.priceUsd.toFixed(ride.priceUsd % 1 === 0 ? 0 : 2)}
                  </span>
                  <span className="text-xs font-bold text-[#164B35] bg-[#164B35]/10 px-2.5 py-0.5 rounded-full">
                    Rs. {ride.priceLkr.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openBookingModal(ride)}
                className="px-4 py-2.5 rounded-xl bg-[#164B35] hover:bg-[#0B3024] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Book a Ride</span>
                <ArrowRight className="w-4 h-4 text-[#E8B44C]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Book a Ride Modal */}
      {selectedRide && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#164B35]/15 my-8"
          >
            {/* Modal Header */}
            <div className="bg-[#0B3024] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E8B44C]">
                  <Sparkles className="w-3 h-3" />
                  INSTANT TUK TUK RESERVATION
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  Book Your Ride
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingRef ? (
              /* Confirmation State */
              <div className="p-6 sm:p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#164B35] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#202820]">
                  Ride Booking Sent!
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Thank you, <strong>{customerName}</strong>! Your booking request for{" "}
                  <strong>{selectedDestination}</strong> on{" "}
                  <strong>{pickupDate}</strong> at <strong>{pickupTime}</strong> has
                  been emailed to our dispatch team.
                </p>
                <div className="bg-[#FFF8ED] border border-[#E8B44C] rounded-2xl p-4 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking Reference:</span>
                    <span className="font-mono font-extrabold text-[#164B35]">
                      {bookingRef}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected Destination:</span>
                    <span className="font-bold text-[#202820]">
                      {selectedDestination}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fare:</span>
                    <span className="font-bold text-[#164B35]">
                      ${selectedRide.priceUsd} USD / Rs.{" "}
                      {selectedRide.priceLkr.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Passengers:</span>
                    <span className="font-bold text-[#202820]">
                      {passengers} Guest(s)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-3.5 rounded-xl bg-[#164B35] hover:bg-[#0B3024] text-white font-bold text-sm transition"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* 1. Selected Destination */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                    Selected Destination *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#164B35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={selectedDestination}
                      onChange={(e) => handleDestinationChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#164B35]/25 text-sm font-bold text-[#202820] focus:outline-none focus:border-[#164B35]"
                      required
                    >
                      {rides.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name} — ${r.priceUsd} / Rs. {r.priceLkr.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Your Name */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                      required
                    />
                  </div>
                </div>

                {/* 3. WhatsApp Number & 4. Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Pick-up Date & 6. Pick-up Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Pick-up Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Pick-up Time *
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 7. Number of Passengers */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                    Number of Passengers *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Price Summary Box */}
                <div className="bg-[#FFF8ED] rounded-2xl p-3.5 border border-[#E8B44C]/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-gray-500 block">
                      Estimated Ride Rate
                    </span>
                    <span className="text-xs text-gray-600">
                      Pay directly to driver (No advance fee)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#0B3024] block">
                      ${selectedRide.priceUsd.toFixed(selectedRide.priceUsd % 1 === 0 ? 0 : 2)} USD
                    </span>
                    <span className="text-xs font-bold text-[#164B35]">
                      Rs. {selectedRide.priceLkr.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Button: Book via Email */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#164B35] hover:bg-[#0B3024] disabled:opacity-60 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-[#E8B44C]" />
                    <span>{submitting ? "Sending Booking..." : "Book via Email"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

