import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { BookingDetailActionsClient } from "@/components/admin/BookingDetailActionsClient";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Mail,
  Phone,
  Globe
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBookingDetailPage({
  params
}: {
  params: { id: string };
}) {
  const admin = await requireAdmin();

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      destination: true,
      tourPackage: true,
      customer: true,
      items: true
    }
  });

  if (!booking) {
    notFound();
  }

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-forest hover:underline mb-2 no-print"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to All Bookings
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl sm:text-3xl font-black text-brand-dark">
                {booking.bookingReference}
              </h1>
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-brand-forest text-brand-gold">
                {booking.status}
              </span>
            </div>
            <p className="text-xs text-brand-dark/65 mt-1">
              Submitted on {new Date(booking.createdAt).toLocaleString()} • Type:{" "}
              {booking.bookingType}
            </p>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Details */}
          <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card space-y-3 text-sm">
            <h2 className="font-serif text-lg font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              Customer Information
            </h2>
            <p className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-brand-forest" />
              <span>
                <strong>Full Name:</strong> {booking.customerName}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-forest" />
              <span>
                <strong>Email:</strong> {booking.customerEmail}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-forest" />
              <span>
                <strong>Phone / WhatsApp:</strong> {booking.customerPhone}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-brand-forest" />
              <span>
                <strong>Country:</strong> {booking.customerCountry}
              </span>
            </p>
          </div>

          {/* Ride & Pickup Schedule */}
          <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card space-y-3 text-sm">
            <h2 className="font-serif text-lg font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              Tour & Pickup Details
            </h2>
            <p className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-brand-forest" />
              <span>
                <strong>Experience:</strong>{" "}
                {booking.destination?.name ||
                  booking.tourPackage?.name ||
                  booking.customTitle ||
                  booking.bookingType}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-brand-forest" />
              <span>
                <strong>Booking Date:</strong>{" "}
                {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-brand-forest" />
              <span>
                <strong>Pickup Time:</strong> {booking.bookingTime}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-brand-forest" />
              <span>
                <strong>Passengers:</strong> {booking.passengers} Guest(s)
              </span>
            </p>
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-forest mt-0.5" />
              <span>
                <strong>Pickup Address:</strong> {booking.pickupLocation}{" "}
                {booking.hotelName ? `(${booking.hotelName})` : ""}
              </span>
            </p>
            {booking.specialRequests && (
              <div className="p-3 rounded-xl bg-brand-cream text-xs text-brand-dark mt-2">
                <strong>Guest Special Requests:</strong> {booking.specialRequests}
              </div>
            )}
          </div>
        </div>

        {/* Pricing Breakdown & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card space-y-2.5 text-sm">
            <h2 className="font-serif text-lg font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              Server-Calculated Price Breakdown
            </h2>
            <div className="flex justify-between">
              <span className="text-brand-dark/70">Base Price:</span>
              <span className="font-bold">
                {formatCurrency(booking.basePrice, booking.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-dark/70">Additional Vehicle Charges:</span>
              <span className="font-bold">
                +{formatCurrency(booking.additionalCharges, booking.currency)}
              </span>
            </div>
            <div className="flex justify-between text-brand-forest">
              <span>Promotional Discount:</span>
              <span>-{formatCurrency(booking.itemDiscount, booking.currency)}</span>
            </div>
            <div className="flex justify-between text-brand-forest">
              <span>Coupon Savings ({booking.couponCode || "None"}):</span>
              <span>-{formatCurrency(booking.couponDiscount, booking.currency)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-brand-forest/10 text-lg font-black text-brand-forest">
              <span>Total Price:</span>
              <span>{formatCurrency(booking.totalPrice, booking.currency)}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card space-y-2.5 text-xs">
            <h2 className="font-serif text-lg font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              Booking Lifecycle Timeline
            </h2>
            <p>
              <strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()}
            </p>
            {booking.confirmedAt && (
              <p className="text-emerald-700">
                <strong>Confirmed At:</strong>{" "}
                {new Date(booking.confirmedAt).toLocaleString()}
              </p>
            )}
            {booking.completedAt && (
              <p className="text-brand-forest">
                <strong>Completed At:</strong>{" "}
                {new Date(booking.completedAt).toLocaleString()}
              </p>
            )}
            {booking.cancelledAt && (
              <p className="text-gray-600">
                <strong>Cancelled At:</strong>{" "}
                {new Date(booking.cancelledAt).toLocaleString()}
              </p>
            )}
            {booking.rejectedAt && (
              <p className="text-red-600">
                <strong>Rejected At:</strong>{" "}
                {new Date(booking.rejectedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Admin Actions Client */}
        <BookingDetailActionsClient booking={booking} />
      </div>
    </AdminShell>
  );
}

