"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  saveTourPackageAction,
  deleteTourPackageAction
} from "@/app/actions/admin-actions";
import { calculateFinalPrice, slugify } from "@/lib/utils";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Plus, Edit3, Trash2, X, MapPin } from "lucide-react";

export function AdminToursClient({
  packages,
  destinations
}: {
  packages: Array<any>;
  destinations: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [id, setId] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85"
  );
  const [duration, setDuration] = useState("7 - 8 Hours (Full Day)");
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("04:00 PM");
  const [minPassengers, setMinPassengers] = useState(1);
  const [maxPassengers, setMaxPassengers] = useState(3);
  const [price, setPrice] = useState(55);
  const [discountType, setDiscountType] = useState("FIXED");
  const [discountValue, setDiscountValue] = useState(10);
  const [destinationIds, setDestinationIds] = useState<string[]>([]);
  const [inclusionsText, setInclusionsText] = useState(
    "Private Tuk Tuk Charter (Up to 3 Guests)\nExperienced English-Speaking Driver-Guide\nHotel Pickup & Drop-off\nBottled Water & Waiting Time"
  );
  const [exclusionsText, setExclusionsText] = useState(
    "Personal Lunch & Beverages\nOptional Factory Entry Tickets"
  );
  const [itineraryJson, setItineraryJson] = useState(
    "08:00 AM | Hotel Pickup & Nine Arch Bridge | Watch the morning blue train cross the nine arches\n11:00 AM | Halpe Tea Factory Tour |Guided factory tour & highland tea tasting\n02:30 PM | Little Adam's Peak Ridge Hike | 360-degree panoramic views over Ella Gap"
  );
  const [terms, setTerms] = useState("Free cancellation up to 12 hours before departure.");
  const [popular, setPopular] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [active, setActive] = useState(true);

  const previewFinal = calculateFinalPrice(price, discountType, discountValue);

  const openCreate = () => {
    setId(undefined);
    setName("");
    setSlug("");
    setTagline("Signature Ella Highland Tuk Tuk Circuit");
    setShortDescription("");
    setDescription("");
    setPrice(50);
    setDiscountType("NONE");
    setDiscountValue(0);
    setDestinationIds(destinations.slice(0, 3).map((d) => d.id));
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setId(p.id);
    setName(p.name);
    setSlug(p.slug);
    setTagline(p.tagline);
    setShortDescription(p.shortDescription);
    setDescription(p.description);
    setCoverImage(p.coverImage);
    setDuration(p.duration);
    setStartTime(p.startTime);
    setEndTime(p.endTime);
    setMinPassengers(p.minPassengers);
    setMaxPassengers(p.maxPassengers);
    setPrice(p.price);
    setDiscountType(p.discountType);
    setDiscountValue(p.discountValue);
    setDestinationIds((p.destinations || []).map((d: any) => d.destinationId));
    setInclusionsText((p.inclusions || []).join("\n"));
    setExclusionsText((p.exclusions || []).join("\n"));
    if (Array.isArray(p.itinerary)) {
      setItineraryJson(
        p.itinerary
          .map((it: any) => `${it.time} | ${it.title} | ${it.description}`)
          .join("\n")
      );
    }
    setTerms(p.terms || "");
    setPopular(Boolean(p.popular));
    setFeatured(Boolean(p.featured));
    setActive(Boolean(p.active));
    setShowForm(true);
  };

  const toggleDestSelection = (destId: string) => {
    setDestinationIds((prev) =>
      prev.includes(destId) ? prev.filter((i) => i !== destId) : [...prev, destId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await saveTourPackageAction({
        id,
        name,
        slug: slug || slugify(name),
        tagline,
        shortDescription,
        description,
        coverImage,
        duration,
        startTime,
        endTime,
        minPassengers,
        maxPassengers,
        price,
        currency: "USD",
        discountType,
        discountValue,
        destinationIds,
        inclusionsText,
        exclusionsText,
        itineraryJson,
        terms,
        popular,
        featured,
        active
      });
      if (!res.success) {
        toast.error(res.error || "Could not save tour package.");
      } else {
        toast.success(id ? "Tour package updated!" : "Tour package created!");
        setShowForm(false);
        router.refresh();
      }
    } catch {
      toast.error("Error saving package.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pkgId: string, pkgName: string) => {
    if (!confirm(`Delete tour package "${pkgName}"?`)) return;
    await deleteTourPackageAction(pkgId);
    toast.success(`Deleted ${pkgName}`);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="px-5 py-2.5 rounded-xl bg-brand-forest hover:bg-brand-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 text-brand-gold" />
          Create New Tour Package
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-forest/25 shadow-premium space-y-6"
        >
          <div className="flex items-center justify-between border-b border-brand-forest/10 pb-4">
            <h2 className="font-serif text-2xl font-bold text-brand-dark">
              {id ? `Edit Package: ${name}` : "Create Multi-Stop Tour Package"}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-2 rounded-xl bg-brand-cream"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Package Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!id) setSlug(slugify(e.target.value));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Tagline *
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
              Short Summary *
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
              Full Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              required
            />
          </div>

          <ImageUploadField
            label="Package Cover Photo (Upload from Computer/Phone or Paste URL) *"
            value={coverImage}
            onChange={setCoverImage}
          />

          {/* Select Included Destinations */}
          <div>
            <label className="block text-xs font-bold uppercase text-brand-forest mb-2">
              Select Included Ella Destinations ({destinationIds.length} Selected)
            </label>
            <div className="flex flex-wrap gap-2">
              {destinations.map((d) => {
                const selected = destinationIds.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDestSelection(d.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                      selected
                        ? "bg-brand-forest text-white border-brand-forest"
                        : "bg-brand-cream/60 text-brand-dark border-brand-forest/20"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule, Capacity & Price */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 bg-brand-cream/60 p-4 rounded-2xl border border-brand-forest/15">
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                Base Price ($)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                DiscountType
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
              >
                <option value="NONE">None</option>
                <option value="PERCENTAGE">% Off</option>
                <option value="FIXED">$ Off</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                Discount (${previewFinal})
              </label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Itinerary Stops (Time | Title | Description per line)
              </label>
              <textarea
                rows={4}
                value={itineraryJson}
                onChange={(e) => setItineraryJson(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Inclusions (One per line)
              </label>
              <textarea
                rows={4}
                value={inclusionsText}
                onChange={(e) => setInclusionsText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Exclusions (One per line)
              </label>
              <textarea
                rows={4}
                value={exclusionsText}
                onChange={(e) => setExclusionsText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-brand-forest/10">
            <div className="flex gap-5 text-xs font-bold">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                Published
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                Featured
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 rounded-xl bg-brand-forest text-white text-xs font-bold shadow-md"
            >
              {loading ? "Saving..." : "Save Tour Package"}
            </button>
          </div>
        </form>
      )}

      {/* Packages List */}
      <div className="grid grid-cols-1 gap-5">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <img
                src={pkg.coverImage}
                alt={pkg.name}
                className="w-24 h-24 rounded-2xl object-cover shrink-0"
              />
              <div>
                <span className="text-xs font-bold uppercase text-brand-forest">
                  {pkg.duration} • {pkg.startTime} - {pkg.endTime}
                </span>
                <h3 className="font-serif text-xl font-bold text-brand-dark">
                  {pkg.name}
                </h3>
                <p className="text-xs text-brand-dark/70 mt-0.5">
                  {pkg.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(pkg.destinations || []).map((d: any) => (
                    <span
                      key={d.id}
                      className="text-[11px] bg-brand-cream px-2.5 py-0.5 rounded-full font-semibold text-brand-forest border border-brand-forest/15"
                    >
                      {d.destination?.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-center shrink-0">
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-brand-dark/50">
                  Package Rate
                </span>
                <span className="text-2xl font-black text-brand-forest">
                  ${pkg.finalPrice}
                </span>
                {pkg.finalPrice < pkg.price && (
                  <span className="text-xs line-through text-brand-dark/40 ml-1">
                    ${pkg.price}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => openEdit(pkg)}
                className="p-2.5 rounded-xl bg-brand-cream hover:bg-brand-gold text-brand-deep"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(pkg.id, pkg.name)}
                className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

