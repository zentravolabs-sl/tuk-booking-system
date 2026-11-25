"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  updateReviewAction,
  deleteReviewAction
} from "@/app/actions/admin-actions";
import { Star, CheckCircle2, XCircle, Sparkles, Trash2 } from "lucide-react";

export function AdminReviewsClient({ reviews }: { reviews: Array<any> }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  r.status === "APPROVED"
                    ? "bg-emerald-100 text-emerald-800"
                    : r.status === "PENDING"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {r.status}
              </span>
              {r.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-gold text-brand-deep">
                  FEATURED
                </span>
              )}
              <div className="flex items-center gap-0.5 text-brand-gold">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-brand-gold" />
                ))}
              </div>
              <span className="text-xs font-bold text-brand-dark">
                {r.customerName} ({r.country})
              </span>
              {r.bookingReference && (
                <span className="text-xs font-mono text-brand-forest">
                  #{r.bookingReference}
                </span>
              )}
            </div>
            {r.title && (
              <h3 className="font-serif font-bold text-base text-brand-dark">
                &ldquo;{r.title}&rdquo;
              </h3>
            )}
            <p className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed">
              {r.comment}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={async () => {
                await updateReviewAction(r.id, "APPROVED", r.featured);
                toast.success("Review approved for public display");
                router.refresh();
              }}
              className="px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve
            </button>
            <button
              type="button"
              onClick={async () => {
                await updateReviewAction(r.id, r.status, !r.featured);
                toast.success("Updated featured flag");
                router.refresh();
              }}
              className="px-3 py-2 rounded-xl bg-brand-cream hover:bg-brand-gold text-brand-deep text-xs font-bold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {r.featured ? "Unfeature" : "Feature"}
            </button>
            <button
              type="button"
              onClick={async () => {
                await updateReviewAction(r.id, "REJECTED", false);
                toast.success("Review hidden/rejected");
                router.refresh();
              }}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </button>
            <button
              type="button"
              onClick={async () => {
                await deleteReviewAction(r.id);
                toast.success("Review deleted");
                router.refresh();
              }}
              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

