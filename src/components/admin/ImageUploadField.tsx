"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";

export function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "Paste image URL or click Upload Image..."
}: {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        toast.error(data.error || "Could not upload image.");
      } else {
        onChange(data.url);
        toast.success("Photo uploaded successfully!");
      }
    } catch {
      toast.error("Failed to upload photo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase text-brand-forest">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
          required
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-[#f3c15a] text-brand-deep font-extrabold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm transition"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload Photo from Device</span>
            </>
          )}
        </button>
      </div>
      {value && (
        <div className="flex items-center gap-2.5 pt-1">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-brand-forest/20 bg-brand-deep shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <span className="text-[11px] text-brand-dark/65 truncate flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-brand-forest shrink-0" />
            Ready: {value}
          </span>
        </div>
      )}
    </div>
  );
}

