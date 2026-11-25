import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminOffersClient } from "@/components/admin/AdminOffersClient";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const admin = await requireAdmin();

  const [offers, coupons] = await Promise.all([
    prisma.offer.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.coupon.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Promotions & Coupon Abuse Prevention
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Offers & Coupons Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Manage seasonal campaigns, percentage/fixed discounts, per-customer usage
            limits, and expiration dates.
          </p>
        </div>

        <AdminOffersClient offers={offers} coupons={coupons} />
      </div>
    </AdminShell>
  );
}

