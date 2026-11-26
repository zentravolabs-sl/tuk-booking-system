"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  customerLogoutAction,
  updateCustomerProfileAction,
  cancelCustomerBookingAction
} from "@/app/actions/customer-auth-actions";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Users,
  LogOut,
  User,
  Mail,
  Phone,
  Globe,
  Compass,
  Car,
  Sparkles,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  X
} from "lucide-react";

interface DashboardCustomer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  createdAt: string | Date;
}

export function CustomerDashboardClient({
  customer,
  bookings,
  ridesCatalog,
  whatsappNumber = "+94785089432"
}: {
  customer: DashboardCustomer;
  bookings: any[];
  ridesCatalog: any[];
  whatsappNumber?: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "tours" | "rides" | "profile">("all");
  const [loggingOut, setLoggingOut] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<{
    id: string;
    title: string;
    bookingReference?: string;
    bookingDate?: string;
    bookingTime?: string;
    passengers?: number;
    totalPrice?: number;
    currency?: string;
  } | null>(null);

  // Profile Form State
  const [fullName, setFullName] = useState(customer.fullName);
  const [phone, setPhone] = useState(
    customer.phone === "Not provided" ? "" : customer.phone
  );
  const [country, setCountry] = useState(
    customer.country === "International" ? "" : customer.country
  );
  const [savingProfile, setSavingProfile] = useState(false);

  const isTourPackageBooking = (b: any) =>
    b.bookingType === "TOUR_PACKAGE" || Boolean(b.tourPackageId);

  const tourBookings = bookings.filter((b) => isTourPackageBooking(b));
  const rideBookings = bookings.filter((b) => !isTourPackageBooking(b));

  const displayedBookings =
    activeTab === "tours"
      ? tourBookings
      : activeTab === "rides"
      ? rideBookings
      : bookings;

  const totalSpent = bookings
    .filter((b) => b.status !== "CANCELLED" && b.status !== "REJECTED")
    .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await customerLogoutAction();
      toast.success("Signed out of your customer account.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Unable to sign out right now.");
      setLoggingOut(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await updateCustomerProfileAction({
        fullName,
        phone,
        country
      });
      if (!res.success) {
        toast.error(res.error || "Could not update profile.");
      } else {
        toast.success("Your profile details have been updated!");
        router.refresh();
      }
    } catch {
      toast.error("Unable to update profile right now.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleConfirmCancelBooking = async () => {
    if (!cancelModalBooking) return;
    const bookingId = cancelModalBooking.id;

    setCancellingId(bookingId);
    try {
      const res = await cancelCustomerBookingAction(bookingId);
      if (!res.success) {
        toast.error(res.error || "Could not cancel booking.");
      } else {
        toast.success("Booking cancelled.");
        setCancelModalBooking(null);
        router.refresh();
      }
    } catch {
      toast.error("Unable to cancel booking right now.");
    } finally {
      setCancellingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-300",
    CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-300",
    IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-300",
    COMPLETED: "bg-[#164B35] text-white border-[#164B35]",
    CANCELLED: "bg-gray-200 text-gray-700 border-gray-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300"
  };

  const findMatchingRideFromCatalog = (booking: any) => {
    const itemTitle = booking.items?.[0]?.title || booking.customTitle || "";
    const cleanedTitle = itemTitle.replace(/\s*\(Our Rides\)\s*$/i, "").trim().toLowerCase();
    return ridesCatalog.find(
      (r) =>
        r.name.toLowerCase() === cleanedTitle ||
        cleanedTitle.includes(r.name.toLowerCase())
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Customer Welcome Header */}
      <div className="bg-[#0B3024] text-white rounded-3xl p-6 sm:p-8 border border-[#E8B44C]/30 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E8B44C] bg-white/10 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Customer Account</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold">
            Ayubowan, {customer.fullName}!
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#E8B44C]" />
              {customer.email}
            </span>
            {customer.phone && customer.phone !== "Not provided" && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E8B44C]" />
                {customer.phone}
              </span>
            )}
            {customer.country && customer.country !== "International" && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#E8B44C]" />
                {customer.country}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/#our-rides"
            className="px-4 py-2.5 rounded-xl bg-[#E8B44C] hover:bg-[#f3c15a] text-[#0B3024] font-extrabold text-xs sm:text-sm transition inline-flex items-center gap-1.5 shadow-sm"
          >
            <Car className="w-4 h-4" />
            <span>Book a Ride</span>
          </Link>
          <Link
            href="/tours"
            className="px-4 py-2.5 rounded-xl bg-[#164B35] hover:bg-[#1e6346] text-white border border-white/15 font-bold text-xs sm:text-sm transition inline-flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-[#E8B44C]" />
            <span>Explore Tours</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-white border border-white/15 font-bold text-xs sm:text-sm transition inline-flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-[#E8B44C]" />
            <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-brand-forest/15 shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/55 block">
            All My Bookings
          </span>
          <span className="font-serif text-3xl font-bold text-brand-dark mt-1 block">
            {bookings.length}
          </span>
          <span className="text-xs text-brand-forest font-semibold mt-1 block">
            Linked to {customer.email}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-brand-forest/15 shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/55 block">
            Tour Packages
          </span>
          <span className="font-serif text-3xl font-bold text-[#164B35] mt-1 block">
            {tourBookings.length}
          </span>
          <span className="text-xs text-brand-dark/65 mt-1 block">
            Guided multi-stop day tours
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-brand-forest/15 shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/55 block">
            Tuk Tuk Rides
          </span>
          <span className="font-serif text-3xl font-bold text-[#164B35] mt-1 block">
            {rideBookings.length}
          </span>
          <span className="text-xs text-brand-dark/65 mt-1 block">
            Point-to-point &amp; destination rides
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-brand-forest/15 shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/55 block">
            Total Trip Value
          </span>
          <span className="font-serif text-3xl font-bold text-brand-forest mt-1 block">
            {formatCurrency(totalSpent, "USD")}
          </span>
          <span className="text-xs text-brand-dark/65 mt-1 block">
            Payable directly to driver
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-forest/15 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
            activeTab === "all"
              ? "bg-[#164B35] text-white shadow-sm"
              : "bg-white text-brand-dark/75 hover:bg-brand-forest/10 border border-brand-forest/15"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#E8B44C]" />
          <span>All Bookings ({bookings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tours")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
            activeTab === "tours"
              ? "bg-[#164B35] text-white shadow-sm"
              : "bg-white text-brand-dark/75 hover:bg-brand-forest/10 border border-brand-forest/15"
          }`}
        >
          <Compass className="w-4 h-4 text-[#E8B44C]" />
          <span>My Tour Packages ({tourBookings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rides")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
            activeTab === "rides"
              ? "bg-[#164B35] text-white shadow-sm"
              : "bg-white text-brand-dark/75 hover:bg-brand-forest/10 border border-brand-forest/15"
          }`}
        >
          <Car className="w-4 h-4 text-[#E8B44C]" />
          <span>My Ride Details ({rideBookings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
            activeTab === "profile"
              ? "bg-[#164B35] text-white shadow-sm"
              : "bg-white text-brand-dark/75 hover:bg-brand-forest/10 border border-brand-forest/15"
          }`}
        >
          <User className="w-4 h-4 text-[#E8B44C]" />
          <span>Account &amp; Profile</span>
        </button>
      </div>

      {/* PROFILE TAB */}
      {activeTab === "profile" ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-forest/15 shadow-card max-w-2xl">
          <h2 className="font-serif text-2xl font-bold text-brand-dark mb-1">
            Customer Profile Details
          </h2>
          <p className="text-xs sm:text-sm text-brand-dark/70 mb-6">
            Your email address serves as your verified username and automatically links your tour package and ride bookings.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                Username (Verified Email Address)
              </label>
              <input
                type="email"
                value={customer.email}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-sm text-gray-600 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United Kingdom"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-3.5 rounded-xl bg-[#164B35] hover:bg-[#0B3024] text-white font-extrabold text-sm shadow-sm transition"
            >
              {savingProfile ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </form>
        </div>
      ) : displayedBookings.length === 0 ? (
        /* EMPTY STATE */
        <div className="bg-white rounded-3xl p-10 text-center border border-brand-forest/15 shadow-card max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-forest/10 text-brand-forest flex items-center justify-center mx-auto">
            {activeTab === "tours" ? (
              <Compass className="w-7 h-7" />
            ) : (
              <Car className="w-7 h-7" />
            )}
          </div>
          <h3 className="font-serif text-2xl font-bold text-brand-dark">
            {activeTab === "tours"
              ? "No Tour Package Bookings Yet"
              : activeTab === "rides"
              ? "No Tuk Tuk Ride Bookings Yet"
              : "You Have No Bookings Yet"}
          </h3>
          <p className="text-xs sm:text-sm text-brand-dark/70 max-w-md mx-auto leading-relaxed">
            When you book a tour package or local tuk tuk ride using your email address{" "}
            <strong className="text-brand-forest">{customer.email}</strong>, all your
            booking details will appear right here.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/tours"
              className="px-5 py-3 rounded-xl bg-[#164B35] hover:bg-[#0B3024] text-white font-extrabold text-xs sm:text-sm transition inline-flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#E8B44C]" />
              <span>Browse Tour Packages</span>
            </Link>
            <Link
              href="/#our-rides"
              className="px-5 py-3 rounded-xl bg-[#E8B44C] hover:bg-[#f3c15a] text-[#0B3024] font-extrabold text-xs sm:text-sm transition inline-flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Book a Local Ride</span>
            </Link>
          </div>
        </div>
      ) : (
        /* SIMPLE TABLE VIEW FOR ALL BOOKINGS / MY TOUR PACKAGES / MY RIDE DETAILS */
        <div className="bg-white rounded-3xl border border-brand-forest/15 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-cream/70 border-b border-brand-forest/15 text-[11px] font-extrabold uppercase tracking-wider text-brand-dark/65">
                  <th className="py-4 px-5">Name</th>
                  <th className="py-4 px-5">Date &amp; Time</th>
                  <th className="py-4 px-5">Passengers</th>
                  <th className="py-4 px-5">Price</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-forest/10 text-xs sm:text-sm">
                {displayedBookings.map((booking) => {
                  const isTour = isTourPackageBooking(booking);
                  const matchedRide = !isTour
                    ? findMatchingRideFromCatalog(booking)
                    : null;
                  const title =
                    booking.tourPackage?.name ||
                    booking.destination?.name ||
                    matchedRide?.name ||
                    booking.customTitle ||
                    booking.items?.[0]?.title ||
                    "Ella Tuk Tuk Experience";

                  const isCancelled = booking.status === "CANCELLED";
                  const isCompleted = booking.status === "COMPLETED";
                  const isRejected = booking.status === "REJECTED";
                  const canCancel = !isCancelled && !isCompleted && !isRejected;

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-brand-cream/30 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-4 px-5">
                        <div className="font-serif font-bold text-brand-dark text-sm sm:text-base">
                          {title}
                        </div>
                        <span className="text-[11px] font-semibold text-brand-forest">
                          {isTour ? "Tour Package" : "Tuk Tuk Ride"}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-brand-dark">
                          <Calendar className="w-3.5 h-3.5 text-brand-forest shrink-0" />
                          <span>
                            {new Date(booking.bookingDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-brand-dark/70 mt-1">
                          <Clock className="w-3.5 h-3.5 text-brand-forest shrink-0" />
                          <span>{booking.bookingTime}</span>
                        </div>
                      </td>

                      {/* Passengers */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-brand-dark">
                          <Users className="w-3.5 h-3.5 text-brand-forest shrink-0" />
                          {booking.passengers}{" "}
                          {booking.passengers === 1 ? "Guest" : "Guests"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-extrabold text-base text-[#164B35]">
                          {formatCurrency(booking.totalPrice, booking.currency)}
                        </span>
                        {matchedRide?.priceLkr && (
                          <span className="block text-[11px] font-semibold text-brand-dark/65">
                            Rs. {Number(matchedRide.priceLkr).toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                            statusColors[booking.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 whitespace-nowrap text-right">
                        {canCancel ? (
                          <button
                            type="button"
                            onClick={() =>
                              setCancelModalBooking({
                                id: booking.id,
                                title,
                                bookingReference: booking.bookingReference,
                                bookingDate: booking.bookingDate,
                                bookingTime: booking.bookingTime,
                                passengers: booking.passengers,
                                totalPrice: booking.totalPrice,
                                currency: booking.currency
                              })
                            }
                            disabled={cancellingId === booking.id}
                            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold transition inline-flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>
                              {cancellingId === booking.id
                                ? "Cancelling..."
                                : "Cancel Booking"}
                            </span>
                          </button>
                        ) : (
                          <span className="text-xs text-brand-dark/45 font-semibold">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOKING CANCEL CONFIRMATION MODAL */}
      {cancelModalBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => {
            if (!cancellingId) setCancelModalBooking(null);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full border border-brand-forest/20 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#0B3024] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-red-300">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8B44C] block">
                    Confirm Cancellation
                  </span>
                  <h3 className="font-serif text-lg font-bold leading-tight">
                    Cancel This Booking?
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                disabled={Boolean(cancellingId)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed">
                Are you sure you want to cancel your booking for{" "}
                <strong className="text-brand-dark">
                  {cancelModalBooking.title}
                </strong>
                ? Our dispatch team will be notified by email immediately.
              </p>

              <div className="bg-brand-cream/80 rounded-2xl p-4 border border-brand-forest/15 space-y-2 text-xs">
                {cancelModalBooking.bookingReference && (
                  <div className="flex items-center justify-between">
                    <span className="text-brand-dark/60 font-semibold">
                      Reference
                    </span>
                    <span className="font-mono font-extrabold text-[#164B35]">
                      {cancelModalBooking.bookingReference}
                    </span>
                  </div>
                )}
                {cancelModalBooking.bookingDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-brand-dark/60 font-semibold">
                      Date &amp; Time
                    </span>
                    <span className="font-bold text-brand-dark">
                      {new Date(
                        cancelModalBooking.bookingDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                      {cancelModalBooking.bookingTime
                        ? ` • ${cancelModalBooking.bookingTime}`
                        : ""}
                    </span>
                  </div>
                )}
                {cancelModalBooking.passengers && (
                  <div className="flex items-center justify-between">
                    <span className="text-brand-dark/60 font-semibold">
                      Passengers
                    </span>
                    <span className="font-bold text-brand-dark">
                      {cancelModalBooking.passengers}{" "}
                      {cancelModalBooking.passengers === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>
                )}
                {cancelModalBooking.totalPrice !== undefined && (
                  <div className="flex items-center justify-between pt-1.5 border-t border-brand-forest/10">
                    <span className="text-brand-dark/60 font-semibold">
                      Total Amount
                    </span>
                    <span className="font-extrabold text-sm text-[#164B35]">
                      {formatCurrency(
                        cancelModalBooking.totalPrice,
                        cancelModalBooking.currency || "USD"
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  disabled={Boolean(cancellingId)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-dark font-bold text-xs sm:text-sm transition disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancelBooking}
                  disabled={Boolean(cancellingId)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm transition inline-flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                >
                  <XCircle className="w-4 h-4" />
                  <span>
                    {cancellingId ? "Cancelling..." : "Yes, Cancel Booking"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
