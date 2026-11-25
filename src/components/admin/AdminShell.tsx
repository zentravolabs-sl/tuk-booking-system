"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminLogoutAction } from "@/app/actions/admin-actions";
import {
  Compass,
  LayoutDashboard,
  CalendarCheck,
  MapPin,
  Package,
  Tag,
  Image as ImageIcon,
  Star,
  Users,
  MessageSquare,
  FileText,
  Mail,
  Settings,
  ShieldAlert,
  UserCog,
  LogOut,
  Menu,
  X,
  ExternalLink
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/tours", label: "Tour Packages", icon: Package },
  { href: "/admin/offers", label: "Offers & Coupons", icon: Tag },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Contact Messages", icon: MessageSquare },
  { href: "/admin/content", label: "Website Content", icon: FileText },
  { href: "/admin/email-templates", label: "Email Templates", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldAlert }
];

export function AdminShell({
  admin,
  children
}: {
  admin: { id: string; name: string; email: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await adminLogoutAction();
    toast.success("Signed out of admin portal.");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-brand-deep text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 no-print">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-gold text-brand-deep flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="block font-serif font-bold text-base leading-none">
              Ella Tuk Tuk
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-brand-gold font-semibold">
              Admin Console
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-brand-forest text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-brand-deep text-white flex flex-col justify-between border-r border-white/10 transition-transform duration-300 lg:static lg:translate-x-0 no-print ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="overflow-y-auto">
          {/* Logo Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold text-brand-deep flex items-center justify-center shadow">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-white leading-none">
                  Kavith Tuk Tuk
                </span>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-brand-gold font-semibold mt-1">
                  Admin Control Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                      ? "bg-brand-gold text-brand-deep font-extrabold shadow-sm"
                      : "text-brand-cream/85 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-forest text-brand-gold font-bold text-xs flex items-center justify-center shrink-0 border border-brand-gold/30">
              {admin.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{admin.name}</p>
              <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider">
                {admin.role}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-center flex items-center justify-center gap-1"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/35 text-red-200 text-[11px] font-bold flex items-center justify-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

