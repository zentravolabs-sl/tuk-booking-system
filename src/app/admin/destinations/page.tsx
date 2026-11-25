import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDestinationsClient } from "@/components/admin/AdminDestinationsClient";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const admin = await requireAdmin();

  const [destinations, categories] = await Promise.all([
    prisma.destination.findMany({
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } }
      },
      orderBy: [{ popular: "desc" }, { name: "asc" }]
    }),
    prisma.destinationCategory.findMany({
      orderBy: { sortOrder: "asc" }
    })
  ]);

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Highland Landmarks & Pricing CMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Destinations Management ({destinations.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Create, edit, price, discount, reorder images, and publish Ella destinations
            without touching code.
          </p>
        </div>

        <AdminDestinationsClient
          destinations={destinations}
          categories={categories}
        />
      </div>
    </AdminShell>
  );
}

