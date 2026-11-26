import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminRidesClient } from "@/components/admin/AdminRidesClient";

export const dynamic = "force-dynamic";

export default async function AdminRidesPage() {
  const admin = await requireAdmin();

  const [rides, settings] = await Promise.all([
    prisma.ride.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    }),
    prisma.siteSettings.findUnique({ where: { id: "default" } })
  ]);

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Home Page • Our Rides Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Our Rides ({rides.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Add and manage Tuk Tuk rides displayed in the &ldquo;Our Rides&rdquo; section on
            the home page with dual pricing (USD &amp; Rs), custom tags (e.g., Most Popular,
            Best Value, Nature &amp; Waterfall), and instant email booking.
          </p>
        </div>

        <AdminRidesClient
          rides={rides}
          exchangeRateLkr={settings?.exchangeRateLkr || 305}
        />
      </div>
    </AdminShell>
  );
}

