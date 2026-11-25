"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  previewBookingPriceAction,
  submitBookingAction
} from "@/app/actions/booking-actions";
import type { ServerPricingResult } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { BookingType } from "@prisma/client";
import {
  MapPin,
  Calendar,
  Users,
  Navigation,
  UserCheck,
  Tag,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Copy,
  Check
} from "lucide-react";

const BOOKING_TYPES: Array<{
  value: BookingType;
  label: string;
  desc: string;
}> = [
    {
      value: "DESTINATION_RIDE",
      label: "Destination Ride",
      desc: "Single landmark ride with waiting time & return transfer"
    },
    {
      value: "TOUR_PACKAGE",
      label: "Tour Package",
      desc: "All-inclusive multi-stop half-day or full-day Tuk Tuk safari"
    },
    {
      value: "CUSTOM_TOUR",
      label: "Custom Tour",
      desc: "Design your own flexible half-day or full-day highland route"
    },
    {
      value: "TRAIN_STATION_PICKUP",
      label: "Train Station Pickup",
      desc: "Ella or Demodara Railway Station meet & greet transfer"
    },
    {
      value: "HOTEL_PICKUP",
      label: "Hotel Pickup",
      desc: "Point-to-point Ella hotel, resort, or restaurant ride"
    },
    {
      value: "AIRPORT_TRANSFER",
      label: "Airport Transfer",
      desc: "Private long-distance transfer (CMB / Mattala / South Coast)"
    },
    {
      value: "TAXI_TRANSFER",
      label: "Taxi Transfer",
      desc: "Intercity transfer to Mirissa, Yala, Udawalawe, Kandy, or Arugam Bay"
    }
  ];

const PICKUP_TIMES = [
  "05:00 AM (Sunrise Special)",
  "05:30 AM (Sunrise Hike)",
  "06:30 AM",
  "07:30 AM",
  "08:00 AM (Standard Morning)",
  "08:30 AM (Nine Arch Train Slot)",
  "09:30 AM",
  "10:30 AM",
  "01:00 PM",
  "02:30 PM",
  "03:30 PM (Sunset Slot)",
  "04:30 PM",
  "06:00 PM",
  "Custom / Train Arrival Time"
];

const STEPS = [
  { num: 1, title: "Destination / Package", icon: MapPin },
  { num: 2, title: "Date & Time", icon: Calendar },
  { num: 3, title: "Passengers", icon: Users },
  { num: 4, title: "Pickup Details", icon: Navigation },
  { num: 5, title: "Guest Info", icon: UserCheck },
  { num: 6, title: "Coupon Code", icon: Tag },
  { num: 7, title: "Review & Submit", icon: CheckCircle2 }
];

export function MultiStepBookingWizard({
  destinations,
  packages,
  initialType = "DESTINATION_RIDE",
  initialDestinationId = "",
  initialPackageId = "",
  initialDate = "",
  initialPassengers = 2,
  initialCoupon = ""
}: {
  destinations: Array<{
    id: string;
    name: string;
    shortDescription: string;
    price: number;
    finalPrice: number;
    distance: string;
    travelTime: string;
    coverImage: string;
  }>;
  packages: Array<{
    id: string;
    name: string;
    tagline: string;
    duration: string;
    price: number;
    finalPrice: number;
    coverImage: string;
  }>;
  initialType?: BookingType;
  initialDestinationId?: string;
  initialPackageId?: string;
  initialDate?: string;
  initialPassengers?: number;
  initialCoupon?: string;
}) {
  const defaultDate =
    initialDate ||
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState<BookingType>(initialType);
  const [destinationId, setDestinationId] = useState(
    initialDestinationId || destinations[0]?.id || ""
  );
  const [tourPackageId, setTourPackageId] = useState(
    initialPackageId || packages[0]?.id || ""
  );
  const [customTitle, setCustomTitle] = useState("");
  const [bookingDate, setBookingDate] = useState(defaultDate);
  const [bookingTime, setBookingTime] = useState("08:00 AM (Standard Morning)");
  const [passengers, setPassengers] = useState(initialPassengers || 2);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCountry, setCustomerCountry] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [couponCode, setCouponCode] = useState(initialCoupon || "");

  const [pricing, setPricing] = useState<ServerPricingResult | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Recalculate price on server whenever selection, passengers, or coupon changes
  useEffect(() => {
    let active = true;
    setLoadingPrice(true);
    previewBookingPriceAction({
      bookingType,
      destinationId: bookingType === "DESTINATION_RIDE" ? destinationId : null,
      tourPackageId: bookingType === "TOUR_PACKAGE" ? tourPackageId : null,
      passengers,
      couponCode: couponCode.trim() || null,
      customerEmail: customerEmail.trim() || null
    })
      .then((res) => {
        if (active) setPricing(res);
      })
      .catch(() => { })
      .finally(() => {
        if (active) setLoadingPrice(false);
      });
    return () => {
      active = false;
    };
  }, [
    bookingType,
    destinationId,
    tourPackageId,
    passengers,
    couponCode,
    customerEmail
  ]);

  const validateCurrentStep = (): boolean => {
    if (step === 1) {
      if (bookingType === "DESTINATION_RIDE" && !destinationId) {
        toast.error("Please choose a destination.");
        return false;
      }
      if (bookingType === "TOUR_PACKAGE" && !tourPackageId) {
        toast.error("Please choose a tour package.");
        return false;
      }
    }
    if (step === 2) {
      if (!bookingDate || !bookingTime) {
        toast.error("Please choose your date and pickup time.");
        return false;
      }
    }
    if (step === 3) {
      if (passengers < 1 || passengers > 18) {
        toast.error("Passengers must be between 1 and 18.");
        return false;
      }
    }
    if (step === 4) {
      if (pickupLocation.trim().length < 3) {
        toast.error("Please enter your hotel or pickup location in Ella.");
        return false;
      }
    }
    if (step === 5) {
      if (customerName.trim().length < 2) {
        toast.error("Please enter your full name.");
        return false;
      }
      if (!customerEmail.includes("@")) {
        toast.error("Please enter a valid email address.");
        return false;
      }
      if (customerPhone.trim().length < 6) {
        toast.error("Please enter your phone or WhatsApp number.");
        return false;
      }
      if (customerCountry.trim().length < 2) {
        toast.error("Please enter your country.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setStep((prev) => Math.min(7, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await submitBookingAction({
        bookingType,
        destinationId: bookingType === "DESTINATION_RIDE" ? destinationId : null,
        tourPackageId: bookingType === "TOUR_PACKAGE" ? tourPackageId : null,
        customTitle: customTitle || null,
        bookingDate,
        bookingTime,
        passengers,
        pickupLocation,
        dropoffLocation: dropoffLocation || null,
        hotelName: hotelName || null,
        customerName,
        customerEmail,
        customerPhone,
        customerCountry,
        specialRequests: specialRequests || null,
        couponCode: couponCode.trim() || null
      });

      if (!result.success) {
        toast.error(result.error || "Could not submit booking.");
        return;
      }

      setConfirmedRef(result.bookingReference || null);
      toast.success(`Booking confirmed! Reference: ${result.bookingReference}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmation View after Step 7 submission
  if (confirmedRef) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-forest/20 shadow-premium max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-brand-forest text-brand-gold flex items-center justify-center mx-auto mb-5 shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-forest bg-brand-forest/10 px-3.5 py-1.5 rounded-full">
          Reservation Received • Instant Reference
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-3">
          Ayubowan, {customerName}! Your Ella Tuk Tuk Ride is Booked
        </h2>
        <p className="text-sm sm:text-base text-brand-dark/75 mt-2 max-w-xl mx-auto">
          We&apos;ve sent a confirmation email to <strong>{customerEmail}</strong> and
          notified our Ella dispatch team. Save your unique booking reference below:
        </p>

        <div className="my-7 bg-brand-cream border-2 border-dashed border-brand-gold rounded-2xl p-5 max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="text-left">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/55">
              Booking Reference
            </span>
            <span className="font-mono text-2xl font-black text-brand-forest">
              {confirmedRef}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(confirmedRef);
              setCopiedRef(true);
              toast.success("Booking reference copied!");
              setTimeout(() => setCopiedRef(false), 2500);
            }}
            className="px-4 py-2.5 rounded-xl bg-brand-forest text-white text-xs font-bold flex items-center gap-1.5"
          >
            {copiedRef ? <Check className="w-4 h-4 text-brand-gold" /> : <Copy className="w-4 h-4" />}
            {copiedRef ? "Copied" : "Copy"}
          </button>
        </div>

        {pricing && (
          <div className="bg-brand-cream/50 rounded-2xl p-5 max-w-lg mx-auto text-left text-sm space-y-2 border border-brand-forest/10 mb-8">
            <div className="flex justify-between">
              <span className="text-brand-dark/70">Experience:</span>
              <span className="font-bold text-brand-dark">{pricing.itemTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-dark/70">Date & Pickup Time:</span>
              <span className="font-bold text-brand-dark">
                {bookingDate} at {bookingTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-dark/70">Pickup Location:</span>
              <span className="font-bold text-brand-dark">{pickupLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-dark/70">Passengers:</span>
              <span className="font-bold text-brand-dark">
                {passengers} Guest(s) ({pricing.tukTuksRequired} Tuk Tuk)
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-forest/10 text-base">
              <span className="font-bold text-brand-dark">Total Payable After Trip:</span>
              <span className="font-extrabold text-brand-forest">
                {formatCurrency(pricing.totalPrice, pricing.currency)}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/track-booking?ref=${encodeURIComponent(confirmedRef)}&email=${encodeURIComponent(customerEmail)}`}
            className="px-6 py-3.5 rounded-full bg-brand-forest hover:bg-brand-deep text-white font-bold text-sm shadow-md transition flex items-center gap-2"
          >
            <span>Track Live Booking Status</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
          <Link
            href="/"
            className="px-6 py-3.5 rounded-full bg-brand-cream hover:bg-brand-gold/20 text-brand-dark font-bold text-sm border border-brand-forest/20 transition"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left 2 Columns: 7-Step Stepper & Active Step Form */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-brand-forest/15 shadow-premium">
        {/* Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-forest mb-3">
            <span>
              Step {step} of 7: {STEPS[step - 1].title}
            </span>
            <span>{Math.round((step / 7) * 100)}% Complete</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {STEPS.map((s) => {
              const isDone = s.num < step;
              const isCurrent = s.num === step;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (s.num < step) setStep(s.num);
                  }}
                  className={`h-2.5 rounded-full transition-all ${isCurrent
                      ? "bg-brand-gold"
                      : isDone
                        ? "bg-brand-forest"
                        : "bg-brand-forest/15"
                    }`}
                  title={`Step ${s.num}: ${s.title}`}
                />
              );
            })}
          </div>
          <div className="hidden sm:grid grid-cols-7 gap-1 mt-2 text-[11px] font-semibold text-brand-dark/65">
            {STEPS.map((s) => (
              <span
                key={s.num}
                className={s.num === step ? "text-brand-forest font-bold" : ""}
              >
                {s.num}. {s.title.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>

        {/* STEP 1: Select Booking Type & Destination / Package */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">
                1. Select Your Ride Type & Highland Experience
              </h2>
              <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
                Choose from our 7 specialized Ella Tuk Tuk & transfer service types.
              </p>
            </div>

            {/* 7 Booking Types */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BOOKING_TYPES.map((bt) => {
                const selected = bookingType === bt.value;
                return (
                  <button
                    key={bt.value}
                    type="button"
                    onClick={() => setBookingType(bt.value)}
                    className={`p-4 rounded-2xl border text-left transition-all ${selected
                        ? "bg-brand-forest text-white border-brand-forest shadow-md"
                        : "bg-brand-cream/50 text-brand-dark border-brand-forest/15 hover:border-brand-forest"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{bt.label}</span>
                      {selected && (
                        <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                      )}
                    </div>
                    <p
                      className={`text-xs mt-1 ${selected ? "text-brand-cream/85" : "text-brand-dark/65"
                        }`}
                    >
                      {bt.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Destination Selector */}
            {bookingType === "DESTINATION_RIDE" && (
              <div className="pt-4 border-t border-brand-forest/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-3">
                  Choose Your Ella Destination ({destinations.length} Available)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {destinations.map((dest) => {
                    const active = destinationId === dest.id;
                    return (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => setDestinationId(dest.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition ${active
                            ? "border-2 border-brand-forest bg-brand-forest/5"
                            : "border-brand-forest/15 bg-white hover:border-brand-forest/40"
                          }`}
                      >
                        <img
                          src={dest.coverImage}
                          alt={dest.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-serif font-bold text-sm text-brand-dark truncate">
                            {dest.name}
                          </p>
                          <p className="text-[11px] text-brand-dark/60">
                            {dest.distance} • {dest.travelTime}
                          </p>
                          <p className="text-xs font-extrabold text-brand-forest mt-1">
                            ${dest.finalPrice}{" "}
                            {dest.finalPrice < dest.price && (
                              <span className="line-through text-brand-dark/40 font-normal">
                                ${dest.price}
                              </span>
                            )}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tour Package Selector */}
            {bookingType === "TOUR_PACKAGE" && (
              <div className="pt-4 border-t border-brand-forest/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-3">
                  Choose Your Curated Tour Package
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {packages.map((pkg) => {
                    const active = tourPackageId === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setTourPackageId(pkg.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition ${active
                            ? "border-2 border-brand-forest bg-brand-forest/5"
                            : "border-brand-forest/15 bg-white hover:border-brand-forest/40"
                          }`}
                      >
                        <img
                          src={pkg.coverImage}
                          alt={pkg.name}
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1">
                          <span className="text-[11px] font-bold uppercase text-brand-forest">
                            {pkg.duration}
                          </span>
                          <h4 className="font-serif font-bold text-base text-brand-dark">
                            {pkg.name}
                          </h4>
                          <p className="text-xs text-brand-dark/70 line-clamp-1">
                            {pkg.tagline}
                          </p>
                          <p className="text-sm font-extrabold text-brand-forest mt-1">
                            ${pkg.finalPrice}{" "}
                            {pkg.finalPrice < pkg.price && (
                              <span className="line-through text-brand-dark/40 font-normal text-xs">
                                ${pkg.price}
                              </span>
                            )}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Route or Transfer Note */}
            {bookingType !== "DESTINATION_RIDE" && bookingType !== "TOUR_PACKAGE" && (
              <div className="pt-4 border-t border-brand-forest/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                  Desired Route or Transfer Details (Optional)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Ella to Mirissa Beach Hotel / Custom Photography Stops"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Select Date and Time */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">
                2. Select Your Date & Pickup Time
              </h2>
              <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
                We operate 24/7 including 5:00 AM sunrise departures and late train
                arrivals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
                  Booking Date *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-brand-cream/60 border border-brand-forest/20 text-sm font-bold text-brand-dark focus:outline-none focus:border-brand-forest"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
                  Preferred Pickup Time *
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-brand-cream/60 border border-brand-forest/20 text-sm font-bold text-brand-dark focus:outline-none focus:border-brand-forest"
                >
                  {PICKUP_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Select Passenger Count */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">
                3. Select Passenger Count
              </h2>
              <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
                Each Tuk Tuk comfortably seats up to 3 passengers. For 4+ guests, we
                dispatch a synchronized convoy of Tuk Tuks traveling together!
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPassengers(num)}
                  className={`py-4 rounded-2xl border font-bold text-sm transition ${passengers === num
                      ? "bg-brand-forest text-white border-brand-forest shadow-md"
                      : "bg-brand-cream/60 text-brand-dark border-brand-forest/15 hover:border-brand-forest"
                    }`}
                >
                  {num} {num === 1 ? "Guest" : "Guests"}
                </button>
              ))}
            </div>

            <div className="bg-brand-cream/80 rounded-2xl p-4 border border-brand-forest/15 text-xs text-brand-dark/80 flex items-center justify-between">
              <span>
                Selected: <strong>{passengers} Passenger(s)</strong>
              </span>
              <span className="font-bold text-brand-forest">
                Vehicles Assigned: {Math.ceil(passengers / 3)} Tuk Tuk(s)
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: Pickup Location */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">
                4. Enter Pickup & Hotel Location
              </h2>
              <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
                Tell us where your driver should meet you in Ella.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                Pickup Address / Meeting Point *
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g., 98 Acres Resort Lobby / Ella Railway Station Exit"
                className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                  Hotel / Homestay Name (Optional)
                </label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="e.g., EKHO Ella / Morning Dew Hotel"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                  Drop-off Location (Optional)
                </label>
                <input
                  type="text"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  placeholder="Same as pickup or another hotel/station"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Customer Details */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">
                5. Enter Your Contact Details
              </h2>
              <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
                We use your email and WhatsApp number to send your instant booking
                reference and driver details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Sophie Vance"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="sophie@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+44 7700 900412"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                  Country *
                </label>
                <input
                  type="text"
                  value={customerCountry}
                  onChange={(e) => setCustomerCountry(e.target.value)}
                  placeholder="e.g., United Kingdom, Germany, Australia"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                Special Requests / Train Number / Child Seats (Optional)
              </label>
              <textarea
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Tell us if you want to time your ride with the blue train, need luggage space, etc."
                className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
              />
            </div>
          </div>
        )}

        {/* STEP 6: Enter Coupon Code */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">
                6. Have a Promotional Coupon Code?
              </h2>
              <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
                Enter your promo code below for instant server-side discount verification,
                or pick one of our active highland codes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code (e.g., ELLA15, SUNRISE8, TUKTUK20)"
                className="flex-1 px-4 py-3.5 rounded-xl bg-brand-cream/70 border border-brand-forest/25 font-mono font-bold text-sm uppercase text-brand-dark focus:outline-none focus:border-brand-forest"
              />
              {couponCode && (
                <button
                  type="button"
                  onClick={() => setCouponCode("")}
                  className="px-4 py-3 rounded-xl border border-brand-forest/20 text-xs font-bold text-brand-dark hover:bg-brand-cream"
                >
                  Clear Code
                </button>
              )}
            </div>

            {pricing?.couponMessage && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${pricing.couponValid
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                    : "bg-amber-50 text-amber-800 border border-amber-300"
                  }`}
              >
                <Tag className="w-4 h-4 shrink-0" />
                <span>{pricing.couponMessage}</span>
              </div>
            )}

            <div className="pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-brand-dark/60 mb-2.5">
                Quick-Apply Available Promo Codes:
              </span>
              <div className="flex flex-wrap gap-2">
                {["ELLA15", "SUNRISE8", "TUKTUK20"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCouponCode(c)}
                    className="px-3.5 py-2 rounded-xl bg-brand-cream border border-dashed border-brand-forest/30 hover:border-brand-forest text-xs font-mono font-bold text-brand-forest transition"
                  >
                    + Apply {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Review & Submit */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">
                7. Review Your Booking & Confirm
              </h2>
              <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
                Verify your itinerary and contact details below before submitting.
              </p>
            </div>

            <div className="bg-brand-cream/60 rounded-2xl p-5 border border-brand-forest/15 space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-brand-forest/10">
                <span className="text-brand-dark/65">Selected Experience:</span>
                <span className="font-bold text-brand-dark">{pricing?.itemTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-forest/10">
                <span className="text-brand-dark/65">Date & Time:</span>
                <span className="font-bold text-brand-dark">
                  {bookingDate} • {bookingTime}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-forest/10">
                <span className="text-brand-dark/65">Passengers & Fleet:</span>
                <span className="font-bold text-brand-dark">
                  {passengers} Guest(s) ({pricing?.tukTuksRequired || 1} Tuk Tuk)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-forest/10">
                <span className="text-brand-dark/65">Pickup Location:</span>
                <span className="font-bold text-brand-dark">
                  {pickupLocation} {hotelName ? `(${hotelName})` : ""}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-forest/10">
                <span className="text-brand-dark/65">Guest Name & Country:</span>
                <span className="font-bold text-brand-dark">
                  {customerName} ({customerCountry})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-brand-dark/65">Email & WhatsApp:</span>
                <span className="font-bold text-brand-dark">
                  {customerEmail} • {customerPhone}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-brand-forest bg-brand-forest/10 p-3.5 rounded-xl font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                No advance credit card charge required. Pay your driver directly after your
                trip in USD, EUR, or LKR.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-brand-forest/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-3 rounded-xl border border-brand-forest/20 text-brand-forest hover:bg-brand-forest/5 font-bold text-xs flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Step
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-3.5 rounded-xl bg-brand-forest hover:bg-brand-deep text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <span>Continue to Step {step + 1}</span>
              <ArrowRight className="w-4 h-4 text-brand-gold" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinalSubmit}
              className="px-8 py-4 rounded-2xl bg-brand-gold hover:bg-[#f3c15a] disabled:opacity-50 text-brand-deep font-extrabold text-sm shadow-lg transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? "Confirming Booking..." : "Confirm & Submit Booking"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Live Server-Verified Price Breakdown */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-brand-deep text-white rounded-3xl p-6 sm:p-7 border border-brand-gold/30 shadow-premium">
          <div className="flex items-center gap-2 text-brand-gold text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Server-Verified Price Breakdown</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-white">
            {pricing?.itemTitle || "Calculating Ride..."}
          </h3>

          <div className="mt-6 space-y-3 text-sm border-t border-white/10 pt-4">
            <div className="flex justify-between text-brand-cream/85">
              <span>Base Fare (1 Tuk Tuk):</span>
              <span className="font-semibold">
                {pricing ? formatCurrency(pricing.basePrice, pricing.currency) : "..."}
              </span>
            </div>

            {pricing && pricing.additionalCharges > 0 && (
              <div className="flex justify-between text-brand-cream/85">
                <span>Extra Vehicles ({pricing.tukTuksRequired} Tuk Tuks):</span>
                <span className="font-semibold">
                  +{formatCurrency(pricing.additionalCharges, pricing.currency)}
                </span>
              </div>
            )}

            {pricing && pricing.itemDiscount > 0 && (
              <div className="flex justify-between text-brand-gold font-medium">
                <span>Promotional Discount:</span>
                <span>-{formatCurrency(pricing.itemDiscount, pricing.currency)}</span>
              </div>
            )}

            {pricing && pricing.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Coupon ({pricing.couponCode}):</span>
                <span>-{formatCurrency(pricing.couponDiscount, pricing.currency)}</span>
              </div>
            )}

            <div className="pt-4 border-t border-white/15 flex items-baseline justify-between">
              <div>
                <span className="block text-xs uppercase tracking-wider text-brand-cream/70">
                  Total Price
                </span>
                <span className="text-[11px] text-brand-cream/60">
                  All taxes & waiting included
                </span>
              </div>
              <span className="text-3xl font-extrabold text-brand-gold">
                {loadingPrice
                  ? "..."
                  : pricing
                    ? formatCurrency(pricing.totalPrice, pricing.currency)
                    : "$15"}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-xs text-brand-cream/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Instant Booking Reference (ELLA-YYYY-XXXXXX)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
              <span>English-Speaking Local Ella Driver</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Free Cancellation Up to 12 Hours Before</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

