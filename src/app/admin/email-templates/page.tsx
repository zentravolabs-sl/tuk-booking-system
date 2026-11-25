import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminEmailTemplatesClient } from "@/components/admin/AdminEmailTemplatesClient";

export const dynamic = "force-dynamic";

export default async function AdminEmailTemplatesPage() {
  const admin = await requireAdmin();
  const templates = await prisma.emailTemplate.findMany({
    orderBy: { createdAt: "asc" }
  });

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Resend & React Email Notifications
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Email Templates ({templates.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Customize the automated emails sent when bookings are submitted, confirmed,
            completed, cancelled, or rejected.
          </p>
        </div>

        <AdminEmailTemplatesClient templates={templates} />
      </div>
    </AdminShell>
  );
}

