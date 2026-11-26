"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBookingStatusAction } from "@/app/actions/admin-actions";
import { BookingStatus } from "@prisma/client";
import { Printer, Save, CheckCircle2, XCircle, Play, Ban } from "lucide-react";

export function BookingDetailActionsClient({
  booking
}: {
  booking: {
    id: string;
    status: BookingStatus;
    adminNotes?: string | null;
    driverAssigned?: string | null;
    vehicleNumber?: string | null;
  };
}) {
  const router = useRouter();
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [driverAssigned, setDriverAssigned] = useState(booking.driverAssigned || "");
  const [vehicleNumber, setVehicleNumber] = useState(booking.vehicleNumber || "");
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (targetStatus: BookingStatus) => {
    setLoading(true);
    try {
      const res = await updateBookingStatusAction(
        booking.id,
        targetStatus,
        adminNotes,
        driverAssigned,
        vehicleNumber
      );
      if (res.success) {
        setStatus(targetStatus);
        toast.success(`Booking updated to ${targetStatus} & email notification triggered.`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update booking.");
      }
    } catch {
      toast.error("Error updating booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-forest/15 shadow-card space-y-6 no-print">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-forest/10 pb-4">
        <h3 className="font-serif text-xl font-bold text-brand-dark">
          Dispatch Actions & Driver Assignment
        </h3>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl border border-brand-forest/20 text-xs font-bold text-brand-forest hover:bg-brand-cream flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          Print Booking Details
        </button>
      </div>

      {/* Quick Status Lifecycle Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleUpdate("CONFIRMED")}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          Confirm Booking
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleUpdate("IN_PROGRESS")}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Play className="w-4 h-4" />
          Mark In Progress
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleUpdate("COMPLETED")}
          className="px-4 py-2.5 rounded-xl bg-brand-forest hover:bg-brand-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-brand-gold" />
          Mark Completed
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleUpdate("CANCELLED")}
          className="px-4 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold flex items-center gap-1.5"
        >
          <Ban className="w-4 h-4" />
          Cancel Booking
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleUpdate("REJECTED")}
          className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold flex items-center gap-1.5"
        >
          <XCircle className="w-4 h-4" />
          Reject Booking
        </button>
      </div>

      {/* Driver & Internal Notes Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1">
            Assigned Driver Name
          </label>
          <input
            type="text"
            value={driverAssigned}
            onChange={(e) => setDriverAssigned(e.target.value)}
            placeholder="e.g., Kavith Sasalanka / Kasun Bandara"
            className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1">
            Tuk Tuk Registration Number
          </label>
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="e.g., UP QH-4821"
            className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1">
          Internal Admin & Dispatch Notes
        </label>
        <textarea
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Add internal notes regarding pickup timing, train delays, or special arrangements..."
          className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
        />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => handleUpdate(status)}
        className="px-6 py-3 rounded-xl bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-extrabold text-xs flex items-center gap-2 shadow-sm"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? "Saving..." : "Save Driver & Internal Notes"}</span>
      </button>
    </div>
  );
}

