import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminMessagesClient } from "@/components/admin/AdminMessagesClient";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const admin = await requireAdmin();

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Customer Support Desk
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Contact Messages ({messages.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Inquiries submitted through the website contact form.
          </p>
        </div>

        <AdminMessagesClient messages={messages} />
      </div>
    </AdminShell>
  );
}

