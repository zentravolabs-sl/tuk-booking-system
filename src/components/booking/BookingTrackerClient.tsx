"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { trackCustomerBookingAction } from "@/app/actions/booking-actions";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Truck,
  Printer
} from "lucide-react";

export function BookingTrackerClient({
  initialRef = "",
  initialEmail = ""
}: {
  initialRef?: string;
  initialEmail?: string;
}) {
  const [reference, setReference] = useState(initialRef);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any | null>(null);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!reference.trim() || !email.trim()) {
      toast.error("Please enter both your booking reference and email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await trackCustomerBookingAction(reference, email);
      if (!res.success) {
        setBooking(null);
        toast.error(res.error || "Booking not found.");
      } else {
        setBooking(res.booking);
        toast.success("Booking verified and loaded!");
      }
    } catch {
      toast.error("Unable to verify booking right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef && initialEmail) {
      handleLookup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-300",
    CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-300",
    IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-300",
    COMPLETED: "bg-brand-forest text-white border-brand-forest",
    CANCELLED: "bg-gray-200 text-gray-700 border-gray-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Verification Form */}
      <form
        onSubmit={handleLookup}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-forest/15 shadow-premium no-print"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-forest mb-4">
          <ShieldCheck className="w-4 h-4 text-brand-gold" />
          <span>Secure Customer Verification Required</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
              Booking Reference *
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              placeholder="ELLA-2026-841920"
              className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 font-mono font-bold text-sm uppercase text-brand-dark focus:outline-none focus:border-brand-forest"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
              Registered Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophie.vance@example.com"
              className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-[46px] rounded-xl bg-brand-forest hover:bg-brand-deep text-white font-bold text-xs px-6 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Search className="w-4 h-4 text-brand-gold" />
            <span>{loading ? "Verifying..." : "Verify & Track Booking"}</span>
          </button>
        </div>

        <p className="text-[11px] text-brand-dark/55 mt-3">
          Demo sample to test immediately: Reference{" "}
          <button
            type="button"
            onClick={() => {
              setReference("ELLA-2026-592014");
              setEmail("m.schneider@example.de");
            }}
            className="underline font-mono font-bold text-brand-forest"
          >
            ELLA-2026-592014
          </button>{" "}
          with email{" "}
          <span className="font-mono font-semibold">m.schneider@example.de</span>
        </p>
      </form>

      {/* Verified Booking Card */}
      {booking && (
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-brand-forest/20 shadow-premium space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-brand-forest/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/55">
                Verified Booking Reference
              </span>
              <h2 className="font-mono text-2xl sm:text-3xl font-black text-brand-forest mt-0.5">
                {booking.bookingReference}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${
                  statusColors[booking.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {booking.status}
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print px-3.5 py-2 rounded-xl border border-brand-forest/20 text-xs font-bold text-brand-forest hover:bg-brand-cream flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Voucher
              </button>
            </div>
          </div>

          {/* Status Timeline Bar */}
          <div className="grid grid-cols-4 gap-2 pt-1 pb-3">
            {[
              { label: "Submitted", active: true },
              {
                label: "Confirmed",
                active: ["CONFIRMED", "IN_PROGRESS", "COMPLETED"].includes(
                  booking.status
                )
              },
              {
                label: "Driver On Route",
                active: ["IN_PROGRESS", "COMPLETED"].includes(booking.status)
              },
              { label: "Completed", active: booking.status === "COMPLETED" }
            ].map((st, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center ${
                  st.active
                    ? "bg-brand-forest/10 border-brand-forest text-brand-forest font-bold"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                <span className="text-xs">{st.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-cream/60 rounded-2xl p-5 border border-brand-forest/10 space-y-3 text-sm">
              <h3 className="font-serif font-bold text-base text-brand-dark border-b border-brand-forest/10 pb-2">
                Trip & Pickup Information
              </h3>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-forest shrink-0" />
                <span>
                  <strong>Experience:</strong>{" "}
                  {booking.destination?.name ||
                    booking.tourPackage?.name ||
                    booking.customTitle ||
                    booking.bookingType}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-forest shrink-0" />
                <span>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-forest shrink-0" />
                <span>
                  <strong>Pickup Time:</strong> {booking.bookingTime}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-forest shrink-0" />
                <span>
                  <strong>Passengers:</strong> {booking.passengers} Guest(s)
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                <span>
                  <strong>Pickup Location:</strong> {booking.pickupLocation}
                </span>
              </p>
            </div>

            <div className="bg-brand-cream/60 rounded-2xl p-5 border border-brand-forest/10 space-y-3 text-sm">
              <h3 className="font-serif font-bold text-base text-brand-dark border-b border-brand-forest/10 pb-2">
                Driver Assignment & Pricing Breakdown
              </h3>
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-forest shrink-0" />
                <span>
                  <strong>Assigned Driver:</strong>{" "}
                  {booking.driverAssigned || "Being Assigned by Dispatch"}
                </span>
              </p>
              {booking.vehicleNumber && (
                <p className="text-xs text-brand-dark/75 pl-6">
                  Tuk Tuk Plate: <strong>{booking.vehicleNumber}</strong>
                </p>
              )}

              <div className="pt-3 border-t border-brand-forest/10 space-y-1.5">
                <div className="flex justify-between text-xs text-brand-dark/70">
                  <span>Base Price:</span>
                  <span>{formatCurrency(booking.basePrice, booking.currency)}</span>
                </div>
                {booking.additionalCharges > 0 && (
                  <div className="flex justify-between text-xs text-brand-dark/70">
                    <span>Extra Vehicle Adjustment:</span>
                    <span>
                      +{formatCurrency(booking.additionalCharges, booking.currency)}
                    </span>
                  </div>
                )}
                {booking.itemDiscount > 0 && (
                  <div className="flex justify-between text-xs text-brand-forest">
                    <span>Promotional Discount:</span>
                    <span>-{formatCurrency(booking.itemDiscount, booking.currency)}</span>
                  </div>
                )}
                {booking.couponDiscount > 0 && (
                  <div className="flex justify-between text-xs text-brand-forest">
                    <span>Coupon Savings ({booking.couponCode}):</span>
                    <span>
                      -{formatCurrency(booking.couponDiscount, booking.currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-brand-forest/10 text-base font-extrabold text-brand-forest">
                  <span>Total Price:</span>
                  <span>{formatCurrency(booking.totalPrice, booking.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

