"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  saveGalleryItemAction,
  deleteGalleryItemAction
} from "@/app/actions/admin-actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

export function AdminGalleryClient({
  images,
  categories
}: {
  images: Array<any>;
  categories: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [location, setLocation] = useState("Ella, Sri Lanka");
  const [featured, setFeatured] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await saveGalleryItemAction({
        title,
        description,
        url,
        categoryId,
        location,
        featured,
        visible: true,
        sortOrder
      });
      if (res.success) {
        toast.success("Gallery media added!");
        setTitle("");
        setDescription("");
        setUrl("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card space-y-4"
      >
        <h2 className="font-serif text-xl font-bold text-brand-dark flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-brand-forest" />
          Upload New Photo / Media (Cloudinary & Web Optimized)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Photo Title *"
            className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
            required
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location Label"
            className="px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <ImageUploadField
              label="Photo File or Image URL *"
              value={url}
              onChange={setUrl}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-brand-forest mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="Display Order (1, 2, 3...)"
              className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
            />
          </div>
        </div>

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Caption / Short Description"
          className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-bold">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Feature on Homepage Gallery
          </label>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-forest text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-brand-gold" />
            Add to Gallery
          </button>
        </div>
      </form>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-3xl overflow-hidden border border-brand-forest/15 shadow-card flex flex-col justify-between"
          >
            <div className="relative h-52 bg-brand-deep">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-brand-gold text-brand-deep text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                {img.category?.name}
              </span>
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-serif font-bold text-sm text-brand-dark truncate">
                  {img.title}
                </h4>
                <p className="text-xs text-brand-dark/60 truncate">
                  {img.location} • Order #{img.sortOrder}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await deleteGalleryItemAction(img.id);
                  toast.success("Gallery photo removed");
                  router.refresh();
                }}
                className="p-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 shrink-0"
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

