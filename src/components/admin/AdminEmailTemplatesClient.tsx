"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateEmailTemplateAction } from "@/app/actions/admin-actions";
import { Save, Mail } from "lucide-react";

export function AdminEmailTemplatesClient({
  templates
}: {
  templates: Array<any>;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(templates[0]?.id || "");
  const current = templates.find((t) => t.id === selectedId) || templates[0];

  const [subject, setSubject] = useState(current?.subject || "");
  const [heading, setHeading] = useState(current?.heading || "");
  const [bodyIntro, setBodyIntro] = useState(current?.bodyIntro || "");
  const [footerNote, setFooterNote] = useState(current?.footerNote || "");
  const [ctaText, setCtaText] = useState(current?.ctaText || "");
  const [active, setActive] = useState(Boolean(current?.active ?? true));
  const [loading, setLoading] = useState(false);

  const handleSelect = (tpl: any) => {
    setSelectedId(tpl.id);
    setSubject(tpl.subject);
    setHeading(tpl.heading);
    setBodyIntro(tpl.bodyIntro);
    setFooterNote(tpl.footerNote);
    setCtaText(tpl.ctaText || "");
    setActive(Boolean(tpl.active));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    setLoading(true);
    try {
      const res = await updateEmailTemplateAction({
        id: current.id,
        subject,
        heading,
        bodyIntro,
        footerNote,
        ctaText,
        active
      });
      if (res.success) {
        toast.success(`Email template "${current.name}" updated!`);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Template Picker */}
      <div className="bg-white rounded-3xl p-5 border border-brand-forest/15 shadow-card space-y-2">
        <h3 className="font-serif font-bold text-base text-brand-dark px-2 mb-3">
          Lifecycle Templates
        </h3>
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleSelect(t)}
            className={`w-full text-left p-3.5 rounded-2xl border transition ${
              t.id === selectedId
                ? "bg-brand-forest text-white border-brand-forest"
                : "bg-brand-cream/50 text-brand-dark border-brand-forest/10 hover:border-brand-forest"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">{t.name}</span>
              <Mail className="w-3.5 h-3.5 text-brand-gold" />
            </div>
            <span className="block font-mono text-[10px] opacity-75 mt-1">
              {t.key}
            </span>
          </button>
        ))}
      </div>

      {/* Right Editor */}
      {current && (
        <form
          onSubmit={handleSave}
          className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-brand-forest/15 shadow-card space-y-5"
        >
          <div className="flex items-center justify-between border-b border-brand-forest/10 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-brand-forest">
                {current.key}
              </span>
              <h2 className="font-serif text-xl font-bold text-brand-dark">
                {current.name}
              </h2>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Active
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
              Email Subject Line (Supports {"{{bookingReference}}"})
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
              Banner Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
              Opening Body Paragraph
            </label>
            <textarea
              rows={3}
              value={bodyIntro}
              onChange={(e) => setBodyIntro(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Primary Button CTA Label
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Footer Support Note
              </label>
              <input
                type="text"
                value={footerNote}
                onChange={(e) => setFooterNote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-brand-forest text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4 text-brand-gold" />
            <span>{loading ? "Saving..." : "Save Email Template"}</span>
          </button>
        </form>
      )}
    </div>
  );
}

