import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminBookingsClient } from "@/components/admin/AdminBookingsClient";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const admin = await requireAdmin();

  const [bookings, destinations, packages] = await Promise.all([
    prisma.booking.findMany({
      include: {
        destination: { select: { name: true } },
        tourPackage: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.destination.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    }),
    prisma.tourPackage.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Reservations & Dispatch Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            All Customer Bookings ({bookings.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Search, filter, confirm, reject, complete, or export bookings to CSV.
          </p>
        </div>

        <AdminBookingsClient
          bookings={bookings}
          destinations={destinations}
          packages={packages}
        />
      </div>
    </AdminShell>
  );
}

