import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminToursClient } from "@/components/admin/AdminToursClient";

export const dynamic = "force-dynamic";

export default async function AdminToursPage() {
  const admin = await requireAdmin();

  const [packages, destinations] = await Promise.all([
    prisma.tourPackage.findMany({
      include: {
        destinations: {
          include: { destination: { select: { id: true, name: true } } },
          orderBy: { stopOrder: "asc" }
        }
      },
      orderBy: { createdAt: "asc" }
    }),
    prisma.destination.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Curated Highland Safaris
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Tour Package Management ({packages.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Configure multi-stop tour packages, durations, itineraries, inclusions, and
            package discounts.
          </p>
        </div>

        <AdminToursClient packages={packages} destinations={destinations} />
      </div>
    </AdminShell>
  );
}

