import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const admin = await requireAdmin();
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Security & Compliance Trail
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Admin Audit Logs ({logs.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            Immutable activity trail of all administrative mutations and logins.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-brand-forest/15 text-[11px] font-bold uppercase text-brand-dark/60">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Admin Email</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Entity</th>
                <th className="py-3 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-forest/10">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-brand-cream/40">
                  <td className="py-3 px-3 text-xs text-brand-dark/70 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-medium text-brand-forest">
                    {log.userEmail || "System"}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-[11px] bg-brand-cream px-2.5 py-1 rounded-lg border border-brand-forest/15">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold">{log.entityType}</td>
                  <td className="py-3 px-3 text-xs text-brand-dark/80">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

