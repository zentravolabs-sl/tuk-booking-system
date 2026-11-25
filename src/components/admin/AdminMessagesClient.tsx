"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateContactMessageStatusAction } from "@/app/actions/admin-actions";
import { CheckCircle2, Mail } from "lucide-react";

export function AdminMessagesClient({ messages }: { messages: Array<any> }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div
          key={m.id}
          className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  m.status === "UNREAD"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {m.status}
              </span>
              <span className="font-bold text-sm text-brand-dark">{m.name}</span>
              <span className="text-xs text-brand-forest">{m.email}</span>
              {m.phone && <span className="text-xs text-brand-dark/60">• {m.phone}</span>}
              <span className="text-[11px] text-brand-dark/50">
                • {new Date(m.createdAt).toLocaleString()}
              </span>
            </div>
            <h3 className="font-serif font-bold text-base text-brand-dark">
              {m.subject}
            </h3>
            <p className="text-xs sm:text-sm text-brand-dark/80 whitespace-pre-line">
              {m.message}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
              className="px-3.5 py-2 rounded-xl bg-brand-cream hover:bg-brand-gold text-brand-deep text-xs font-bold flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Reply via Email
            </a>
            {m.status === "UNREAD" && (
              <button
                type="button"
                onClick={async () => {
                  await updateContactMessageStatusAction(m.id, "RESOLVED");
                  toast.success("Marked as resolved");
                  router.refresh();
                }}
                className="px-3.5 py-2 rounded-xl bg-brand-forest text-white text-xs font-bold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                Mark Resolved
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

