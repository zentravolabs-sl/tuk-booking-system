import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSettingsFormClient } from "@/components/admin/AdminSettingsFormClient";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const admin = await requireAdmin();
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6 max-w-5xl">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            No-Code Website Content Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Homepage, About, FAQs & SEO Content
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Update headlines, photography, FAQs, about story, and SEO metadata across the
            customer platform.
          </p>
        </div>

        <AdminSettingsFormClient settings={settings} mode="CONTENT" />
      </div>
    </AdminShell>
  );
}

