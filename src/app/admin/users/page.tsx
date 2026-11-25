import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" }
  });

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Role-Based Authorization (SUPER_ADMIN / ADMIN / MANAGER)
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Admin Users ({users.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Manage staff accounts and role permissions for Ella Tuk Tuk Taxi Service.
          </p>
        </div>

        <AdminUsersClient users={users} currentRole={admin.role} />
      </div>
    </AdminShell>
  );
}

