import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminReviewsClient } from "@/components/admin/AdminReviewsClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const admin = await requireAdmin();

  const reviews = await prisma.customerReview.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }]
  });

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Guest Reputation & Testimonials
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Review Management ({reviews.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Approve, reject, feature, or remove customer reviews. Only approved reviews
            appear publicly.
          </p>
        </div>

        <AdminReviewsClient reviews={reviews} />
      </div>
    </AdminShell>
  );
}

