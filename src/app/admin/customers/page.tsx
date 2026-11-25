import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const admin = await requireAdmin();

  const customers = await prisma.customer.findMany({
    include: {
      _count: { select: { bookings: true } }
    },
    orderBy: { totalSpent: "desc" }
  });

  return (
    <AdminShell admin={admin}>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-forest">
            Traveler Directory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
            Customers ({customers.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70">
            International guests who have booked Ella Tuk Tuk rides or packages.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-brand-forest/15 text-[11px] font-bold uppercase text-brand-dark/60">
                <th className="py-3 px-3">Customer Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Phone / WhatsApp</th>
                <th className="py-3 px-3">Country</th>
                <th className="py-3 px-3">Total Bookings</th>
                <th className="py-3 px-3">Total Spent</th>
                <th className="py-3 px-3">First Booked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-forest/10">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-brand-cream/40">
                  <td className="py-3.5 px-3 font-bold text-brand-dark">{c.fullName}</td>
                  <td className="py-3.5 px-3 text-brand-forest font-medium">{c.email}</td>
                  <td className="py-3.5 px-3">{c.phone}</td>
                  <td className="py-3.5 px-3 font-medium">{c.country}</td>
                  <td className="py-3.5 px-3 font-bold">{c.totalBookings}</td>
                  <td className="py-3.5 px-3 font-extrabold text-brand-forest">
                    {formatCurrency(c.totalSpent, "USD")}
                  </td>
                  <td className="py-3.5 px-3 text-xs text-brand-dark/60">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

