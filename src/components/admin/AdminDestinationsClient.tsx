"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  saveDestinationAction,
  toggleDestinationFlagsAction,
  deleteDestinationAction,
  saveDestinationCategoryAction
} from "@/app/actions/admin-actions";
import { calculateFinalPrice, slugify } from "@/lib/utils";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  Plus,
  Edit3,
  Trash2,
  Flame,
  Sparkles,
  CheckCircle2,
  X,
  FolderPlus
} from "lucide-react";

export function AdminDestinationsClient({
  destinations,
  categories
}: {
  destinations: Array<any>;
  categories: Array<{ id: string; name: string; slug: string; description?: string | null }>;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Destination Form State
  const [id, setId] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85"
  );
  const [galleryUrls, setGalleryUrls] = useState("");
  const [price, setPrice] = useState(15);
  const [currency, setCurrency] = useState("USD");
  const [priceType, setPriceType] = useState("PER_TRIP");
  const [discountType, setDiscountType] = useState("NONE");
  const [discountValue, setDiscountValue] = useState(0);
  const [distance, setDistance] = useState("3.5 km from Ella Town");
  const [travelTime, setTravelTime] = useState("15 mins");
  const [entranceFee, setEntranceFee] = useState("Free Entry");
  const [location, setLocation] = useState("Ella, Sri Lanka");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [includedServicesText, setIncludedServicesText] = useState(
    "Hotel Pickup & Drop-off\nExperienced English-Speaking Driver\n90 Minutes Waiting Time"
  );
  const [highlightsText, setHighlightsText] = useState(
    "Direct scenic viewpoint drop-off\nPhoto stops along the mountain road"
  );
  const [bestTimeToVisit, setBestTimeToVisit] = useState("6:00 AM - 5:00 PM");
  const [popular, setPopular] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Category Form State
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  const previewFinal = calculateFinalPrice(Number(price) || 0, discountType, Number(discountValue) || 0);

  const openCreate = () => {
    setId(undefined);
    setName("");
    setSlug("");
    setCategoryId(categories[0]?.id || "");
    setShortDescription("");
    setDescription("");
    setCoverImage(
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85"
    );
    setGalleryUrls("");
    setPrice(15);
    setDiscountType("NONE");
    setDiscountValue(0);
    setDistance("4.0 km from Ella Town");
    setTravelTime("15 mins");
    setEntranceFee("Free Entry");
    setLocation("Ella, Sri Lanka");
    setGoogleMapsUrl("");
    setPopular(true);
    setFeatured(false);
    setActive(true);
    setSeoTitle("");
    setSeoDescription("");
    setShowForm(true);
  };

  const openEdit = (d: any) => {
    setId(d.id);
    setName(d.name);
    setSlug(d.slug);
    setCategoryId(d.categoryId);
    setShortDescription(d.shortDescription);
    setDescription(d.description);
    setCoverImage(d.coverImage);
    setGalleryUrls((d.images || []).map((img: any) => img.url).join("\n"));
    setPrice(d.price);
    setCurrency(d.currency || "USD");
    setPriceType(d.priceType || "PER_TRIP");
    setDiscountType(d.discountType || "NONE");
    setDiscountValue(d.discountValue || 0);
    setDistance(d.distance);
    setTravelTime(d.travelTime);
    setEntranceFee(d.entranceFee);
    setLocation(d.location);
    setGoogleMapsUrl(d.googleMapsUrl || "");
    setIncludedServicesText((d.includedServices || []).join("\n"));
    setHighlightsText((d.highlights || []).join("\n"));
    setBestTimeToVisit(d.bestTimeToVisit || "6:00 AM - 5:00 PM");
    setPopular(Boolean(d.popular));
    setFeatured(Boolean(d.featured));
    setActive(Boolean(d.active));
    setSeoTitle(d.seoTitle || "");
    setSeoDescription(d.seoDescription || "");
    setShowForm(true);
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await saveDestinationAction({
        id,
        name,
        slug: slug || slugify(name),
        shortDescription,
        description,
        categoryId,
        coverImage,
        galleryUrls,
        price,
        currency,
        priceType,
        discountType,
        discountValue,
        distance,
        travelTime,
        entranceFee,
        location,
        googleMapsUrl,
        includedServicesText,
        highlightsText,
        bestTimeToVisit,
        popular,
        featured,
        active,
        seoTitle,
        seoDescription
      });

      if (!res.success) {
        toast.error(res.error || "Could not save destination.");
      } else {
        toast.success(id ? "Destination updated!" : "New destination created!");
        setShowForm(false);
        router.refresh();
      }
    } catch {
      toast.error("Failed to save destination.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (
    destId: string,
    field: "active" | "popular" | "featured",
    val: boolean
  ) => {
    await toggleDestinationFlagsAction(destId, field, val);
    toast.success(`Updated ${field} status.`);
    router.refresh();
  };

  const handleDelete = async (destId: string, destName: string) => {
    if (!confirm(`Delete destination "${destName}" permanently?`)) return;
    const res = await deleteDestinationAction(destId);
    if (res.success) {
      toast.success(`Deleted ${destName}`);
      router.refresh();
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    await saveDestinationCategoryAction({ name: catName, description: catDesc });
    toast.success(`Category "${catName}" saved.`);
    setCatName("");
    setCatDesc("");
    setShowCatForm(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <span
              key={c.id}
              className="px-3 py-1.5 rounded-full bg-white border border-brand-forest/15 text-xs font-bold text-brand-dark"
            >
              {c.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCatForm(!showCatForm)}
            className="px-4 py-2.5 rounded-xl bg-white border border-brand-forest/20 text-brand-forest text-xs font-bold flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4" />
            Add Category
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="px-5 py-2.5 rounded-xl bg-brand-forest hover:bg-brand-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-brand-gold" />
            Create New Destination
          </button>
        </div>
      </div>

      {/* Category Modal / Box */}
      {showCatForm && (
        <form
          onSubmit={handleSaveCategory}
          className="bg-white rounded-3xl p-6 border border-brand-forest/20 shadow-card space-y-4 max-w-xl"
        >
          <h3 className="font-serif text-lg font-bold text-brand-dark">
            Create Destination Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="Category Name (e.g., Wildlife Safaris)"
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              required
            />
            <input
              type="text"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="Short description"
              className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-forest text-white text-xs font-bold"
            >
              Save Category
            </button>
            <button
              type="button"
              onClick={() => setShowCatForm(false)}
              className="px-4 py-2 rounded-xl border text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Destination Create / Edit Form Drawer */}
      {showForm && (
        <form
          onSubmit={handleSaveDestination}
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-forest/25 shadow-premium space-y-6"
        >
          <div className="flex items-center justify-between border-b border-brand-forest/10 pb-4">
            <h2 className="font-serif text-2xl font-bold text-brand-dark">
              {id ? `Edit Destination: ${name}` : "Create New Ella Destination"}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-2 rounded-xl bg-brand-cream text-brand-dark"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Destination Name *
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
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
              Short Summary (Card Preview) *
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
              Full Detailed Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              required
            />
          </div>

          {/* Pricing & Discounts Configuration */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-brand-cream/60 p-4 rounded-2xl border border-brand-forest/15">
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                Base Price (USD) *
              </label>
              <input
                type="number"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-brand-forest/20 text-sm font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                Price Type
              </label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-brand-forest/20 text-sm"
              >
                <option value="PER_TRIP">Per Trip (Tuk Tuk)</option>
                <option value="PER_PERSON">Per Person</option>
                <option value="PER_HOUR">Per Hour</option>
                <option value="PER_DAY">Per Day</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-brand-forest/20 text-sm"
              >
                <option value="NONE">No Discount</option>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                Discount Value
              </label>
              <input
                type="number"
                step="0.5"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-brand-forest/20 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-brand-forest mb-1">
                Final Computed Price
              </label>
              <div className="px-3 py-2 rounded-xl bg-brand-forest text-brand-gold font-extrabold text-sm">
                ${previewFinal.toFixed(2)} USD
              </div>
            </div>
          </div>

          {/* Logistics & Images */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Distance from Ella *
              </label>
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Travel Time *
              </label>
              <input
                type="text"
                value={travelTime}
                onChange={(e) => setTravelTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Entrance Fee
              </label>
              <input
                type="text"
                value={entranceFee}
                onChange={(e) => setEntranceFee(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Location Label
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploadField
              label="Cover Photo (Upload from Computer/Phone or Paste URL) *"
              value={coverImage}
              onChange={setCoverImage}
            />
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Google Maps URL
              </label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Gallery Image URLs (One per line)
              </label>
              <textarea
                rows={3}
                value={galleryUrls}
                onChange={(e) => setGalleryUrls(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Trip Highlights (One per line)
              </label>
              <textarea
                rows={3}
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Included Services (One per line)
              </label>
              <textarea
                rows={3}
                value={includedServicesText}
                onChange={(e) => setIncludedServicesText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-xs"
              />
            </div>
          </div>

          {/* SEO & Visibility Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                SEO Meta Description
              </label>
              <input
                type="text"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-forest/10">
            <div className="flex flex-wrap items-center gap-6">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                Published / Active
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={(e) => setPopular(e.target.checked)}
                />
                Mark as Popular
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                Mark as Featured
              </label>
            </div>

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
                className="px-7 py-3 rounded-xl bg-brand-forest hover:bg-brand-deep text-white text-xs font-bold shadow-md"
              >
                {loading ? "Saving..." : id ? "Update Destination" : "Publish Destination"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Destinations Table */}
      <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-brand-forest/15 text-[11px] font-bold uppercase tracking-wider text-brand-dark/60">
              <th className="py-3 px-3">Destination</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Base / Final Price</th>
              <th className="py-3 px-3">Distance & Time</th>
              <th className="py-3 px-3">Badges</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-forest/10">
            {destinations.map((d) => (
              <tr key={d.id} className="hover:bg-brand-cream/40">
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={d.coverImage}
                      alt={d.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <p className="font-serif font-bold text-sm text-brand-dark">
                        {d.name}
                      </p>
                      <p className="text-[11px] font-mono text-brand-dark/55">
                        /destinations/{d.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 font-medium">{d.category?.name}</td>
                <td className="py-3.5 px-3">
                  <span className="font-extrabold text-brand-forest">
                    ${d.finalPrice}
                  </span>
                  {d.finalPrice < d.price && (
                    <span className="text-xs text-brand-dark/45 line-through ml-1.5">
                      ${d.price}
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-3 text-xs text-brand-dark/75">
                  {d.distance} • {d.travelTime}
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggle(d.id, "active", !d.active)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                        d.active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {d.active ? "Active" : "Draft"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(d.id, "popular", !d.popular)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                        d.popular
                          ? "bg-brand-gold text-brand-deep"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Flame className="w-3 h-3" />
                      Popular
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(d.id, "featured", !d.featured)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                        d.featured
                          ? "bg-brand-forest text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </button>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(d)}
                      className="p-2 rounded-xl bg-brand-cream hover:bg-brand-gold text-brand-deep transition"
                      title="Edit Destination"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(d.id, d.name)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition"
                      title="Delete Destination"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

