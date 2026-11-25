"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBookingStatusAction } from "@/app/actions/admin-actions";
import { formatCurrency } from "@/lib/utils";
import { BookingStatus } from "@prisma/client";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Eye
} from "lucide-react";

export function AdminBookingsClient({
  bookings,
  destinations,
  packages
}: {
  bookings: Array<any>;
  destinations: Array<{ id: string; name: string }>;
  packages: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [destFilter, setDestFilter] = useState("");
  const [pkgFilter, setPkgFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
    if (destFilter && b.destinationId !== destFilter) return false;
    if (pkgFilter && b.tourPackageId !== pkgFilter) return false;
    if (dateFilter) {
      const bDate = new Date(b.bookingDate).toISOString().split("T")[0];
      if (bDate !== dateFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = b.bookingReference.toLowerCase().includes(q);
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchEmail = b.customerEmail.toLowerCase().includes(q);
      const matchPhone = b.customerPhone.toLowerCase().includes(q);
      if (!matchRef && !matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const handleQuickStatus = async (id: string, status: BookingStatus) => {
    setUpdatingId(id);
    try {
      const res = await updateBookingStatusAction(id, status);
      if (res.success) {
        toast.success(`Booking status updated to ${status}`);
        router.refresh();
      } else {
        toast.error(res.error || "Update failed");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "Booking Reference",
      "Status",
      "Booking Type",
      "Experience",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Country",
      "Passengers",
      "Date",
      "Pickup Time",
      "Pickup Location",
      "Total Price (USD)"
    ];
    const rows = filtered.map((b) => [
      b.bookingReference,
      b.status,
      b.bookingType,
      `"${(b.destination?.name || b.tourPackage?.name || b.customTitle || "").replace(/"/g, '""')}"`,
      `"${b.customerName.replace(/"/g, '""')}"`,
      b.customerEmail,
      b.customerPhone,
      b.customerCountry,
      b.passengers,
      new Date(b.bookingDate).toISOString().split("T")[0],
      `"${b.bookingTime}"`,
      `"${b.pickupLocation.replace(/"/g, '""')}"`,
      b.totalPrice
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ella-tuktuk-bookings-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} bookings to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Filter & Export Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-forest/15 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "REJECTED"].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                    statusFilter === st
                      ? "bg-brand-forest text-white"
                      : "bg-brand-cream text-brand-dark hover:bg-brand-gold/25"
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-extrabold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export Bookings to CSV ({filtered.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-brand-forest/10">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-forest/60 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, customer, email..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-cream/60 border border-brand-forest/15 text-xs"
            />
          </div>

          <select
            value={destFilter}
            onChange={(e) => setDestFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-brand-cream/60 border border-brand-forest/15 text-xs"
          >
            <option value="">All Destinations</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={pkgFilter}
            onChange={(e) => setPkgFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-brand-cream/60 border border-brand-forest/15 text-xs"
          >
            <option value="">All Tour Packages</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-brand-cream/60 border border-brand-forest/15 text-xs"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-brand-forest/15 text-[11px] font-bold uppercase tracking-wider text-brand-dark/60">
              <th className="py-3 px-3">Ref #</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Experience</th>
              <th className="py-3 px-3">Date & Pickup</th>
              <th className="py-3 px-3">Guests</th>
              <th className="py-3 px-3">Total</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-forest/10">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-brand-cream/40">
                <td className="py-3.5 px-3 font-mono font-bold text-brand-forest">
                  <Link href={`/admin/bookings/${b.id}`} className="hover:underline">
                    {b.bookingReference}
                  </Link>
                </td>
                <td className="py-3.5 px-3">
                  <p className="font-bold text-brand-dark">{b.customerName}</p>
                  <p className="text-[11px] text-brand-dark/60">
                    {b.customerEmail} • {b.customerCountry}
                  </p>
                </td>
                <td className="py-3.5 px-3 font-medium text-brand-dark">
                  {b.destination?.name ||
                    b.tourPackage?.name ||
                    b.customTitle ||
                    b.bookingType}
                </td>
                <td className="py-3.5 px-3 text-xs">
                  <p className="font-bold text-brand-dark">
                    {new Date(b.bookingDate).toLocaleDateString()} • {b.bookingTime}
                  </p>
                  <p className="text-[11px] text-brand-dark/60 truncate max-w-[180px]">
                    {b.pickupLocation}
                  </p>
                </td>
                <td className="py-3.5 px-3 font-semibold">{b.passengers}</td>
                <td className="py-3.5 px-3 font-extrabold text-brand-forest">
                  {formatCurrency(b.totalPrice, b.currency)}
                </td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      b.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-800"
                        : b.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : b.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : b.status === "COMPLETED"
                        ? "bg-brand-forest text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {b.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          disabled={updatingId === b.id}
                          onClick={() => handleQuickStatus(b.id, "CONFIRMED")}
                          title="Confirm Booking"
                          className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === b.id}
                          onClick={() => handleQuickStatus(b.id, "REJECTED")}
                          title="Reject Booking"
                          className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {b.status === "CONFIRMED" && (
                      <button
                        type="button"
                        disabled={updatingId === b.id}
                        onClick={() => handleQuickStatus(b.id, "COMPLETED")}
                        title="Mark Completed"
                        className="px-2 py-1 rounded-lg bg-brand-forest text-white text-[11px] font-bold"
                      >
                        Complete
                      </button>
                    )}
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="px-2.5 py-1.5 rounded-lg bg-brand-cream hover:bg-brand-gold text-brand-deep font-bold text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

