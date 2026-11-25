"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveAdminUserAction } from "@/app/actions/admin-actions";
import { AdminRole } from "@prisma/client";
import { UserPlus, ShieldCheck } from "lucide-react";

export function AdminUsersClient({
  users,
  currentRole
}: {
  users: Array<any>;
  currentRole: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("ADMIN");
  const [loading, setLoading] = useState(false);

  const canManage = currentRole === "SUPER_ADMIN";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      toast.error("Only SUPER_ADMIN can create or modify admin users.");
      return;
    }
    setLoading(true);
    try {
      const res = await saveAdminUserAction({
        name,
        email,
        password,
        role,
        active: true
      });
      if (res.success) {
        toast.success(`Admin account ${email} created!`);
        setName("");
        setEmail("");
        setPassword("");
        router.refresh();
      }
    } catch {
      toast.error("Failed to create admin user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {canManage && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card space-y-4"
        >
          <h2 className="font-serif text-xl font-bold text-brand-dark flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-forest" />
            Add Staff / Admin User (Role-Based Access Control)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Staff Full Name *"
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address *"
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 chars) *"
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm font-bold"
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-forest text-white text-xs font-bold"
          >
            Create Admin Account
          </button>
        </form>
      )}

      <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-brand-forest/15 text-[11px] font-bold uppercase text-brand-dark/60">
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Email</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-forest/10">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="py-3.5 px-3 font-bold text-brand-dark">{u.name}</td>
                <td className="py-3.5 px-3 text-brand-forest">{u.email}</td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-forest text-brand-gold text-[10px] font-extrabold">
                    <ShieldCheck className="w-3 h-3" />
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {u.active ? "ACTIVE" : "DISABLED"}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-xs text-brand-dark/60">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

