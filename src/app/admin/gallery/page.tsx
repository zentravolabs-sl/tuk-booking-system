import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminGalleryClient } from "@/components/admin/AdminGalleryClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const admin = await requireAdmin();

  const [images, categories] = await Promise.all([
    prisma.galleryImage.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    }),
    prisma.galleryCategory.findMany({ orderBy: { sortOrder: "asc" } })
  ]);

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Visual Media & Photography CMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Gallery Management ({images.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Upload and organize Tuk Tuk fleet photos, destinations, and traveler memories.
          </p>
        </div>

        <AdminGalleryClient images={images} categories={categories} />
      </div>
    </AdminShell>
  );
}

