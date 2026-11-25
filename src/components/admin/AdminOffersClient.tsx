"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  saveOfferAction,
  deleteOfferAction,
  saveCouponAction,
  deleteCouponAction
} from "@/app/actions/admin-actions";
import { slugify } from "@/lib/utils";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Plus, Trash2, Tag, Sparkles } from "lucide-react";

export function AdminOffersClient({
  offers,
  coupons
}: {
  offers: Array<any>;
  coupons: Array<any>;
}) {
  const router = useRouter();
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Offer state
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDesc, setOfferDesc] = useState("");
  const [offerBadge, setOfferBadge] = useState("SEASONAL OFFER");
  const [offerImage, setOfferImage] = useState(
    "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1000&q=80"
  );
  const [offerType, setOfferType] = useState("SEASONAL_OFFER");
  const [offerDiscountType, setOfferDiscountType] = useState("PERCENTAGE");
  const [offerDiscountVal, setOfferDiscountVal] = useState(15);
  const [offerCouponCode, setOfferCouponCode] = useState("ELLA15");
  const [offerMinAmount, setOfferMinAmount] = useState(20);
  const [offerEndDate, setOfferEndDate] = useState("2027-12-31");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponTitle, setCouponTitle] = useState("");
  const [couponDesc, setCouponDesc] = useState("");
  const [couponDiscountType, setCouponDiscountType] = useState("PERCENTAGE");
  const [couponDiscountVal, setCouponDiscountVal] = useState(15);
  const [couponMinAmount, setCouponMinAmount] = useState(20);
  const [couponMaxDiscount, setCouponMaxDiscount] = useState(25);
  const [couponUsageLimit, setCouponUsageLimit] = useState(200);
  const [couponPerCustomer, setCouponPerCustomer] = useState(1);
  const [couponFirstOnly, setCouponFirstOnly] = useState(false);
  const [couponEndDate, setCouponEndDate] = useState("2027-12-31");

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await saveOfferAction({
        title: offerTitle,
        slug: slugify(offerTitle),
        description: offerDesc,
        badgeText: offerBadge,
        image: offerImage,
        offerType,
        discountType: offerDiscountType,
        discountValue: offerDiscountVal,
        couponCode: offerCouponCode,
        startDate: new Date().toISOString().split("T")[0],
        endDate: offerEndDate,
        minBookingAmount: offerMinAmount,
        perCustomerLimit: 1,
        featured: true,
        active: true
      });
      if (res.success) {
        toast.success("Promotional offer published!");
        setShowOfferForm(false);
        setOfferTitle("");
        setOfferDesc("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save offer");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await saveCouponAction({
        code: couponCode.toUpperCase(),
        title: couponTitle,
        description: couponDesc,
        discountType: couponDiscountType,
        discountValue: couponDiscountVal,
        minBookingAmount: couponMinAmount,
        maxDiscount: couponMaxDiscount,
        startDate: new Date().toISOString().split("T")[0],
        endDate: couponEndDate,
        usageLimit: couponUsageLimit,
        perCustomerLimit: couponPerCustomer,
        firstBookingOnly: couponFirstOnly,
        active: true
      });
      if (res.success) {
        toast.success(`Coupon ${couponCode.toUpperCase()} created!`);
        setShowCouponForm(false);
        setCouponCode("");
        setCouponTitle("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create coupon");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowOfferForm(!showOfferForm)}
          className="px-5 py-2.5 rounded-xl bg-brand-forest text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 text-brand-gold" />
          New Promotional Offer Banner
        </button>
        <button
          type="button"
          onClick={() => setShowCouponForm(!showCouponForm)}
          className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-deep text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
        >
          <Tag className="w-4 h-4" />
          New Coupon Code
        </button>
      </div>

      {/* Create Offer Form */}
      {showOfferForm && (
        <form
          onSubmit={handleCreateOffer}
          className="bg-white rounded-3xl p-6 border-2 border-brand-forest/25 shadow-premium space-y-4"
        >
          <h3 className="font-serif text-xl font-bold text-brand-dark">
            Create Special Promotional Offer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
              placeholder="Offer Title (e.g., Monsoon Waterfall Special 20% Off)"
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              required
            />
            <select
              value={offerType}
              onChange={(e) => setOfferType(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
            >
              <option value="SEASONAL_OFFER">Seasonal Offer</option>
              <option value="FIRST_BOOKING">First Booking Discount</option>
              <option value="PERCENTAGE_DISCOUNT">Percentage Discount</option>
              <option value="FIXED_DISCOUNT">Fixed Amount Discount</option>
              <option value="DESTINATION_DISCOUNT">Destination Discount</option>
              <option value="PACKAGE_DISCOUNT">Package Discount</option>
              <option value="COUPON_CODE">Coupon Code Campaign</option>
              <option value="LIMITED_TIME">Limited Time Offer</option>
            </select>
            <input
              type="text"
              value={offerBadge}
              onChange={(e) => setOfferBadge(e.target.value)}
              placeholder="Badge Text (e.g., EARLY BIRD)"
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
            />
          </div>
          <textarea
            rows={2}
            value={offerDesc}
            onChange={(e) => setOfferDesc(e.target.value)}
            placeholder="Offer description..."
            className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
            required
          />
          <ImageUploadField
            label="Offer Banner Image (Upload Photo or Paste URL) *"
            value={offerImage}
            onChange={setOfferImage}
          />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <select
              value={offerDiscountType}
              onChange={(e) => setOfferDiscountType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed ($)</option>
            </select>
            <input
              type="number"
              value={offerDiscountVal}
              onChange={(e) => setOfferDiscountVal(Number(e.target.value))}
              placeholder="Discount Value"
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs"
            />
            <input
              type="text"
              value={offerCouponCode}
              onChange={(e) => setOfferCouponCode(e.target.value.toUpperCase())}
              placeholder="Linked Coupon Code"
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs font-mono"
            />
            <input
              type="number"
              value={offerMinAmount}
              onChange={(e) => setOfferMinAmount(Number(e.target.value))}
              placeholder="Min Booking ($)"
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs"
            />
            <input
              type="date"
              value={offerEndDate}
              onChange={(e) => setOfferEndDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-forest text-white text-xs font-bold"
          >
            Publish Offer
          </button>
        </form>
      )}

      {/* Create Coupon Form */}
      {showCouponForm && (
        <form
          onSubmit={handleCreateCoupon}
          className="bg-white rounded-3xl p-6 border-2 border-brand-gold shadow-premium space-y-4"
        >
          <h3 className="font-serif text-xl font-bold text-brand-dark">
            Create Server-Validated Coupon Code
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="CODE (e.g., ELLA25)"
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm font-mono font-bold uppercase"
              required
            />
            <input
              type="text"
              value={couponTitle}
              onChange={(e) => setCouponTitle(e.target.value)}
              placeholder="Coupon Title"
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              required
            />
            <input
              type="text"
              value={couponDesc}
              onChange={(e) => setCouponDesc(e.target.value)}
              placeholder="Description"
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <select
              value={couponDiscountType}
              onChange={(e) => setCouponDiscountType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed ($)</option>
            </select>
            <input
              type="number"
              value={couponDiscountVal}
              onChange={(e) => setCouponDiscountVal(Number(e.target.value))}
              placeholder="Value"
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs"
            />
            <input
              type="number"
              value={couponMinAmount}
              onChange={(e) => setCouponMinAmount(Number(e.target.value))}
              placeholder="Min Amount ($)"
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs"
            />
            <input
              type="number"
              value={couponMaxDiscount}
              onChange={(e) => setCouponMaxDiscount(Number(e.target.value))}
              placeholder="Max Discount ($)"
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs"
            />
            <input
              type="number"
              value={couponUsageLimit}
              onChange={(e) => setCouponUsageLimit(Number(e.target.value))}
              placeholder="Usage Limit"
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs"
            />
            <input
              type="date"
              value={couponEndDate}
              onChange={(e) => setCouponEndDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-brand-cream/60 border text-xs"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold">
              <input
                type="checkbox"
                checked={couponFirstOnly}
                onChange={(e) => setCouponFirstOnly(e.target.checked)}
              />
              First Booking Only (Prevent repeat customer usage)
            </label>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-forest text-white text-xs font-bold"
            >
              Save Coupon Code
            </button>
          </div>
        </form>
      )}

      {/* Active Offers List */}
      <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-dark flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-gold" />
          Promotional Offers ({offers.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((o) => (
            <div
              key={o.id}
              className="p-4 rounded-2xl bg-brand-cream/50 border border-brand-forest/15 flex items-start justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-brand-gold text-brand-deep px-2.5 py-0.5 rounded-full">
                  {o.offerType}
                </span>
                <h3 className="font-serif font-bold text-base text-brand-dark mt-1">
                  {o.title}
                </h3>
                <p className="text-xs text-brand-dark/70 mt-0.5">{o.description}</p>
                <p className="text-xs font-bold text-brand-forest mt-2">
                  Code: {o.couponCode || "Auto"} • Valid until{" "}
                  {new Date(o.endDate).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await deleteOfferAction(o.id);
                  toast.success("Offer removed");
                  router.refresh();
                }}
                className="p-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card overflow-x-auto">
        <h2 className="font-serif text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-brand-forest" />
          Coupon Codes ({coupons.length})
        </h2>
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-brand-forest/15 text-[11px] font-bold uppercase text-brand-dark/60">
              <th className="py-3 px-3">Code</th>
              <th className="py-3 px-3">Title</th>
              <th className="py-3 px-3">Discount</th>
              <th className="py-3 px-3">Min Order</th>
              <th className="py-3 px-3">Usages</th>
              <th className="py-3 px-3">Expires</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-forest/10">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="py-3 px-3 font-mono font-extrabold text-brand-forest">
                  {c.code}
                </td>
                <td className="py-3 px-3 font-bold">{c.title}</td>
                <td className="py-3 px-3 font-bold text-brand-forest">
                  {c.discountType === "PERCENTAGE"
                    ? `${c.discountValue}%`
                    : `$${c.discountValue}`}
                </td>
                <td className="py-3 px-3">${c.minBookingAmount}</td>
                <td className="py-3 px-3">
                  {c.usedCount} / {c.usageLimit || "∞"} (Max {c.perCustomerLimit}/guest)
                </td>
                <td className="py-3 px-3">
                  {new Date(c.endDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteCouponAction(c.id);
                      toast.success("Coupon deleted");
                      router.refresh();
                    }}
                    className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

