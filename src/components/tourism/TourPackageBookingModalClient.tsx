"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitBookingAction } from "@/app/actions/booking-actions";
import { getCustomerSessionStatusAction } from "@/app/actions/customer-auth-actions";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  User,
  MapPin,
  Globe,
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Tag
} from "lucide-react";

export function TourPackageBookingModalClient({
  pkg,
  initialCustomer = null
}: {
  pkg: {
    id: string;
    name: string;
    finalPrice: number;
    currency: string;
    startTime: string;
    maxPassengers: number;
  };
  initialCustomer?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    country?: string;
  } | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggedCustomer, setLoggedCustomer] = useState(initialCustomer);

  const [customerName, setCustomerName] = useState(
    initialCustomer?.fullName || ""
  );
  const [customerEmail, setCustomerEmail] = useState(
    initialCustomer?.email || ""
  );
  const [customerPhone, setCustomerPhone] = useState(
    initialCustomer?.phone || ""
  );
  const [customerCountry, setCustomerCountry] = useState(
    initialCustomer?.country || "Sri Lanka / International"
  );
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState(pkg.startTime || "08:00 AM");
  const [passengers, setPassengers] = useState(2);
  const [pickupLocation, setPickupLocation] = useState("Ella Town / Hotel Pickup");
  const [couponCode, setCouponCode] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

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
        setCustomerPhone((prev) => prev || res.customer!.phone || "");
        if (res.customer.country) {
          setCustomerCountry((prev) =>
            !prev || prev === "Sri Lanka / International"
              ? res.customer!.country
              : prev
          );
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const openModal = async () => {
    if (!loggedCustomer) {
      const session = await getCustomerSessionStatusAction().catch(() => null);
      if (!session?.loggedIn || !session.customer) {
        toast.error("Please log in to your account to book this tour package.");
        router.push("/login");
        return;
      }
      setLoggedCustomer(session.customer);
      setCustomerName((prev) => prev || session.customer!.fullName || "");
      setCustomerEmail((prev) => prev || session.customer!.email || "");
      setCustomerPhone((prev) => prev || session.customer!.phone || "");
      if (session.customer.country) {
        setCustomerCountry((prev) =>
          !prev || prev === "Sri Lanka / International"
            ? session.customer!.country
            : prev
        );
      }
    }

    setBookingRef(null);
    if (loggedCustomer) {
      setCustomerName((prev) => prev || loggedCustomer.fullName || "");
      setCustomerEmail((prev) => prev || loggedCustomer.email || "");
      setCustomerPhone((prev) => prev || loggedCustomer.phone || "");
      if (loggedCustomer.country) {
        setCustomerCountry((prev) =>
          !prev || prev === "Sri Lanka / International"
            ? loggedCustomer.country!
            : prev
        );
      }
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedCustomer) {
      toast.error("Please log in to your account to place a booking.");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitBookingAction({
        bookingType: "TOUR_PACKAGE",
        tourPackageId: pkg.id,
        destinationId: null,
        customTitle: pkg.name,
        bookingDate,
        bookingTime,
        passengers: Number(passengers) || 1,
        pickupLocation,
        dropoffLocation: "Ella",
        hotelName: null,
        customerName,
        customerEmail,
        customerPhone,
        customerCountry: customerCountry || "International",
        specialRequests: specialRequests || null,
        couponCode: couponCode || null
      });

      if (!res.success) {
        toast.error(res.error || "Could not submit your tour booking.");
        if ((res as { requiresAuth?: boolean }).requiresAuth) {
          router.push("/login");
        }
      } else {
        setBookingRef(res.bookingReference || "CONFIRMED");
        toast.success("Tour package reserved! Check your email and dashboard.");
      }
    } catch {
      toast.error("Unable to submit booking right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="w-full py-4 px-6 rounded-2xl bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
      >
        <span>Reserve This Tour Package</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#164B35]/15 my-8"
          >
            {/* Header */}
            <div className="bg-[#0B3024] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E8B44C]">
                  <Sparkles className="w-3 h-3" />
                  TOUR PACKAGE RESERVATION
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {pkg.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingRef ? (
              <div className="p-6 sm:p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#164B35] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#202820]">
                  Tour Package Reserved!
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Thank you, <strong>{customerName}</strong>! Your reservation for{" "}
                  <strong>{pkg.name}</strong> on <strong>{bookingDate}</strong> has
                  been submitted.
                </p>
                <div className="bg-[#FFF8ED] border border-[#E8B44C] rounded-2xl p-4 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking Reference:</span>
                    <span className="font-mono font-extrabold text-[#164B35]">
                      {bookingRef}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tour Package:</span>
                    <span className="font-bold text-[#202820]">{pkg.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Passengers:</span>
                    <span className="font-bold text-[#202820]">
                      {passengers} Guest(s)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/dashboard"
                    className="flex-1 py-3.5 rounded-xl bg-[#164B35] hover:bg-[#0B3024] text-white font-bold text-sm transition text-center"
                  >
                    View in My Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-5 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
                {/* Name */}
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

                {/* Mobile / WhatsApp & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Mobile / WhatsApp No *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Email Address *
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

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Tour Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Pickup Time *
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        placeholder="08:00 AM"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Passengers & Pickup Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Passengers *
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min={1}
                        max={18}
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Pickup Hotel / Location *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Your Ella hotel or station"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Country & Optional Coupon Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Country *
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customerCountry}
                        onChange={(e) => setCustomerCountry(e.target.value)}
                        placeholder="e.g. Germany, UK, Sri Lanka"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#164B35] mb-1">
                      Promo Code (Optional)
                    </label>
                    <div className="relative">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="ELLA10"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-mono uppercase text-[#202820] focus:outline-none focus:border-[#164B35] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Package Rate Box */}
                <div className="bg-[#FFF8ED] rounded-2xl p-3.5 border border-[#E8B44C]/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-gray-500 block">
                      Package Rate (Per Tuk Tuk)
                    </span>
                    <span className="text-xs text-gray-600">
                      Up to {pkg.maxPassengers} guests per Tuk Tuk
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#0B3024] block">
                      {formatCurrency(pkg.finalPrice, pkg.currency)}
                    </span>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
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
                    <span>
                      {submitting ? "Submitting Booking..." : "Confirm Tour Booking"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

