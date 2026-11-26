"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  saveRideAction,
  toggleRideActiveAction,
  deleteRideAction
} from "@/app/actions/admin-actions";
import { slugify } from "@/lib/utils";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Tag,
  CarFront,
  RefreshCw
} from "lucide-react";

const PRESET_TAGS = [
  "Most Popular",
  "Best Value",
  "Nature & Waterfall",
  "Sunrise Special",
  "Scenic Viewpoint",
  "Tea & Heritage",
  "Adventure Ride"
];

export function AdminRidesClient({
  rides,
  exchangeRateLkr = 305
}: {
  rides: Array<{
    id: string;
    name: string;
    slug: string;
    shortDescription?: string | null;
    image: string;
    priceUsd: number;
    priceLkr: number;
    tag: string;
    distance?: string | null;
    travelTime?: string | null;
    sortOrder: number;
    active: boolean;
  }>;
  exchangeRateLkr?: number;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [id, setId] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85"
  );
  const [priceUsd, setPriceUsd] = useState<number>(15);
  const [priceLkr, setPriceLkr] = useState<number>(4500);
  const [tag, setTag] = useState("Most Popular");
  const [distance, setDistance] = useState("3.5 km from Ella Town");
  const [travelTime, setTravelTime] = useState("15 mins");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [active, setActive] = useState(true);

  const openCreate = () => {
    setId(undefined);
    setName("");
    setSlug("");
    setShortDescription("");
    setImage(
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85"
    );
    setPriceUsd(15);
    setPriceLkr(Math.round((15 * exchangeRateLkr) / 50) * 50);
    setTag("Most Popular");
    setDistance("3.5 km from Ella Town");
    setTravelTime("15 mins");
    setSortOrder(rides.length + 1);
    setActive(true);
    setShowForm(true);
  };

  const openEdit = (ride: (typeof rides)[number]) => {
    setId(ride.id);
    setName(ride.name);
    setSlug(ride.slug);
    setShortDescription(ride.shortDescription || "");
    setImage(ride.image);
    setPriceUsd(ride.priceUsd);
    setPriceLkr(ride.priceLkr);
    setTag(ride.tag || "Most Popular");
    setDistance(ride.distance || "");
    setTravelTime(ride.travelTime || "");
    setSortOrder(ride.sortOrder || 0);
    setActive(Boolean(ride.active));
    setShowForm(true);
  };

  const handleAutoConvertLkr = () => {
    const calculated = Math.round(((Number(priceUsd) || 0) * exchangeRateLkr) / 50) * 50;
    setPriceLkr(calculated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await saveRideAction({
        id,
        name,
        slug: slug || slugify(name),
        shortDescription,
        image,
        priceUsd,
        priceLkr,
        tag,
        distance,
        travelTime,
        sortOrder,
        active
      });

      if (!res.success) {
        toast.error(res.error || "Failed to save ride.");
      } else {
        toast.success(id ? "Ride updated!" : "New ride added to Home Page!");
        setShowForm(false);
        router.refresh();
      }
    } catch {
      toast.error("Error saving ride.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (rideId: string, nextVal: boolean) => {
    await toggleRideActiveAction(rideId, nextVal);
    toast.success(nextVal ? "Ride published on home page." : "Ride hidden.");
    router.refresh();
  };

  const handleDelete = async (rideId: string, rideName: string) => {
    if (!confirm(`Delete ride "${rideName}" permanently?`)) return;
    const res = await deleteRideAction(rideId);
    if (res.success) {
      toast.success(`Deleted "${rideName}"`);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-brand-dark/60 mr-1">
            Popular Tags:
          </span>
          {PRESET_TAGS.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full bg-white border border-brand-forest/15 text-xs font-bold text-brand-dark"
            >
              {t}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="px-5 py-2.5 rounded-xl bg-brand-forest hover:bg-brand-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4 text-brand-gold" />
          Add New Ride
        </button>
      </div>

      {/* Create / Edit Ride Form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-forest/25 shadow-premium space-y-6"
        >
          <div className="flex items-center justify-between border-b border-brand-forest/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-forest text-brand-gold flex items-center justify-center">
                <CarFront className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-dark">
                  {id ? `Edit Ride: ${name}` : "Add New Ride to Home Page"}
                </h2>
                <p className="text-xs text-brand-dark/60">
                  Set ride name, price in USD &amp; Rs, tag badge, and cover photo.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-2 rounded-xl bg-brand-cream text-brand-dark hover:bg-brand-gold/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ride Name & Tag */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1.5">
                Ride Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!id) setSlug(slugify(e.target.value));
                }}
                placeholder="e.g., Nine Arch Bridge Tuk Tuk Ride"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm font-medium focus:outline-none focus:border-brand-forest"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1.5">
                Ride Tag (e.g., Most Popular, Best Value, Nature &amp; Waterfall) *
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g., Most Popular, Best Value, Nature & Waterfall"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm font-bold text-brand-dark focus:outline-none focus:border-brand-forest"
                required
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {PRESET_TAGS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTag(preset)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                      tag === preset
                        ? "bg-brand-gold text-brand-deep shadow-sm"
                        : "bg-brand-cream text-brand-dark/75 hover:bg-brand-gold/30"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing in USD & Rs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-brand-cream/60 p-5 rounded-2xl border border-brand-forest/15">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1.5">
                Price in USD ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-forest">
                  $
                </span>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-brand-forest/20 text-sm font-extrabold text-brand-dark"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase text-brand-forest">
                  Price in Rs (LKR) *
                </label>
                <button
                  type="button"
                  onClick={handleAutoConvertLkr}
                  className="text-[11px] font-bold text-brand-forest hover:underline flex items-center gap-1"
                  title="Auto-calculate Rs from USD"
                >
                  <RefreshCw className="w-3 h-3" />
                  Auto-calc Rs
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-forest">
                  Rs.
                </span>
                <input
                  type="number"
                  step="50"
                  min="100"
                  value={priceLkr}
                  onChange={(e) => setPriceLkr(Number(e.target.value))}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-brand-forest/20 text-sm font-extrabold text-brand-dark"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1.5">
                Card Price Preview
              </label>
              <div className="px-4 py-2.5 rounded-xl bg-brand-forest text-white flex items-center justify-between">
                <span className="font-extrabold text-base text-brand-gold">
                  ${Number(priceUsd || 0).toFixed(priceUsd % 1 === 0 ? 0 : 2)}
                </span>
                <span className="text-xs font-bold text-white/90">
                  Rs. {Number(priceLkr || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Short Description, Distance, Travel Time & Order */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1.5">
                Short Description / Subtitle (Optional)
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g., Private Tuk Tuk transfer with scenic photo stops & waiting time"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1.5">
                Distance / Route Info
              </label>
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g., 3.5 km from Ella Town"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1.5">
                Duration / Travel Time
              </label>
              <input
                type="text"
                value={travelTime}
                onChange={(e) => setTravelTime(e.target.value)}
                placeholder="e.g., 15 mins • Round Trip"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              />
            </div>
          </div>

          {/* Cover Image & Display Order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <ImageUploadField
                label="Ride Photo (Upload Image or Paste URL) *"
                value={image}
                onChange={setImage}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              />
              <p className="text-[11px] text-brand-dark/55 mt-1">
                Lower numbers appear first in the Our Rides section.
              </p>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-forest/10">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Published on Home Page (&ldquo;Our Rides&rdquo; Section)
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 rounded-xl bg-brand-forest hover:bg-brand-deep text-white text-xs font-bold shadow-md transition"
              >
                {loading ? "Saving..." : id ? "Update Ride" : "Publish Ride"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Rides Table */}
      <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card overflow-x-auto">
        {rides.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <CarFront className="w-10 h-10 text-brand-forest/40 mx-auto" />
            <p className="font-serif text-lg font-bold text-brand-dark">
              No Rides Added Yet
            </p>
            <p className="text-xs text-brand-dark/60 max-w-md mx-auto">
              Click &ldquo;Add New Ride&rdquo; above to add your first ride with USD &amp; Rs
              pricing and tags to the home page.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-brand-forest/15 text-[11px] font-bold uppercase tracking-wider text-brand-dark/60">
                <th className="py-3 px-3">Ride Name</th>
                <th className="py-3 px-3">Tag</th>
                <th className="py-3 px-3">Price (USD &amp; Rs)</th>
                <th className="py-3 px-3">Route / Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-forest/10">
              {rides.map((r) => (
                <tr key={r.id} className="hover:bg-brand-cream/40">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-14 h-12 rounded-xl object-cover shrink-0 border border-brand-forest/10"
                      />
                      <div>
                        <p className="font-serif font-bold text-sm text-brand-dark">
                          {r.name}
                        </p>
                        {r.shortDescription && (
                          <p className="text-[11px] text-brand-dark/60 line-clamp-1 max-w-xs">
                            {r.shortDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 bg-brand-gold text-brand-deep text-[11px] font-extrabold px-3 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      {r.tag}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-extrabold text-brand-forest text-sm">
                      ${r.priceUsd.toFixed(r.priceUsd % 1 === 0 ? 0 : 2)} USD
                    </div>
                    <div className="text-xs font-bold text-brand-dark/70">
                      Rs. {r.priceLkr.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-xs text-brand-dark/75">
                    {r.distance || "Ella"}
                    {r.travelTime ? ` • ${r.travelTime}` : ""}
                  </td>
                  <td className="py-3.5 px-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(r.id, !r.active)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 ${
                        r.active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {r.active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="p-2 rounded-xl bg-brand-cream hover:bg-brand-gold text-brand-deep transition"
                        title="Edit Ride"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id, r.name)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition"
                        title="Delete Ride"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

