"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSiteSettingsAction } from "@/app/actions/admin-actions";
import { Save } from "lucide-react";

export function AdminSettingsFormClient({
  settings,
  mode = "CONTENT"
}: {
  settings: any;
  mode?: "CONTENT" | "SETTINGS";
}) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState(
    settings?.businessName || "Kavith Tuk Tuk Service"
  );
  const [tagline, setTagline] = useState(
    settings?.tagline || "Explore Ella. Experience More."
  );
  const [heroHeadline, setHeroHeadline] = useState(
    settings?.heroHeadline || "Explore Ella. Experience More."
  );
  const [heroSubheadline, setHeroSubheadline] = useState(
    settings?.heroSubheadline || ""
  );
  const [heroBackgroundImage, setHeroBackgroundImage] = useState(
    settings?.heroBackgroundImage || ""
  );
  const [phone, setPhone] = useState(settings?.phone || "0785089432");
  const [whatsapp, setWhatsapp] = useState(settings?.whatsapp || "+94785089432");
  const [email, setEmail] = useState(
    settings?.email || "Kavithsasalanka@gmail.com"
  );
  const [address, setAddress] = useState(settings?.address || "");
  const [currency, setCurrency] = useState(settings?.currency || "USD");
  const [exchangeRateLkr, setExchangeRateLkr] = useState(
    settings?.exchangeRateLkr || 305
  );
  const [airportTransferRate, setAirportTransferRate] = useState(
    settings?.airportTransferRate || 95
  );
  const [hotelPickupRate, setHotelPickupRate] = useState(
    settings?.hotelPickupRate || 8
  );
  const [trainPickupRate, setTrainPickupRate] = useState(
    settings?.trainPickupRate || 5
  );
  const [customTourHourly, setCustomTourHourly] = useState(
    settings?.customTourHourly || 12
  );
  const [facebookUrl, setFacebookUrl] = useState(settings?.facebookUrl || "");
  const [instagramUrl, setInstagramUrl] = useState(settings?.instagramUrl || "");
  const [tripadvisorUrl, setTripadvisorUrl] = useState(
    settings?.tripadvisorUrl || ""
  );
  const [aboutHeadline, setAboutHeadline] = useState(
    settings?.aboutHeadline || ""
  );
  const [aboutStory, setAboutStory] = useState(settings?.aboutStory || "");
  const [aboutMission, setAboutMission] = useState(settings?.aboutMission || "");
  const [aboutImage, setAboutImage] = useState(settings?.aboutImage || "");
  const [faqsJson, setFaqsJson] = useState(
    JSON.stringify(settings?.faqs || [], null, 2)
  );
  const [seoTitle, setSeoTitle] = useState(settings?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(
    settings?.seoDescription || ""
  );
  const [seoKeywords, setSeoKeywords] = useState(settings?.seoKeywords || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateSiteSettingsAction({
        businessName,
        tagline,
        heroHeadline,
        heroSubheadline,
        heroBackgroundImage,
        phone,
        whatsapp,
        email,
        address,
        currency,
        exchangeRateLkr: Number(exchangeRateLkr),
        airportTransferRate: Number(airportTransferRate),
        hotelPickupRate: Number(hotelPickupRate),
        trainPickupRate: Number(trainPickupRate),
        customTourHourly: Number(customTourHourly),
        facebookUrl,
        instagramUrl,
        tripadvisorUrl,
        aboutHeadline,
        aboutStory,
        aboutMission,
        aboutImage,
        faqsJson,
        seoTitle,
        seoDescription,
        seoKeywords
      });
      if (res.success) {
        toast.success("Website content & settings saved to database!");
        router.refresh();
      }
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-forest/15 shadow-card space-y-8"
    >
      {mode === "CONTENT" ? (
        <>
          {/* Homepage Hero CMS */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              Homepage Hero & Branding Content
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Hero Background Image URL
                </label>
                <input
                  type="url"
                  value={heroBackgroundImage}
                  onChange={(e) => setHeroBackgroundImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Hero Supporting Text
              </label>
              <textarea
                rows={2}
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              />
            </div>
          </div>

          {/* About Page CMS */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              About Us Page Story & Mission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  About Page Headline
                </label>
                <input
                  type="text"
                  value={aboutHeadline}
                  onChange={(e) => setAboutHeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  About Feature Image URL
                </label>
                <input
                  type="url"
                  value={aboutImage}
                  onChange={(e) => setAboutImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Our Story Paragraph
              </label>
              <textarea
                rows={4}
                value={aboutStory}
                onChange={(e) => setAboutStory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Our Community Mission
              </label>
              <textarea
                rows={2}
                value={aboutMission}
                onChange={(e) => setAboutMission(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              />
            </div>
          </div>

          {/* FAQs JSON Editor */}
          <div className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              Homepage FAQs (JSON Array of Question & Answer Objects)
            </h2>
            <textarea
              rows={8}
              value={faqsJson}
              onChange={(e) => setFaqsJson(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border font-mono text-xs"
            />
          </div>

          {/* Global SEO */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              Global SEO Metadata
            </h2>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Default SEO Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Default SEO Description
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                Target SEO Keywords
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Business Contact & WhatsApp Settings */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              Business Details, Phone, Email & WhatsApp Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Phone Hotline
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Physical Address (Ella Stand)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
            </div>
          </div>

          {/* Transfer & Base Pricing Settings */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              Transfer & Charter Pricing Settings
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Airport Transfer ($)
                </label>
                <input
                  type="number"
                  value={airportTransferRate}
                  onChange={(e) => setAirportTransferRate(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-brand-cream/60 border text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Hotel Pickup ($)
                </label>
                <input
                  type="number"
                  value={hotelPickupRate}
                  onChange={(e) => setHotelPickupRate(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-brand-cream/60 border text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Train Station Pickup ($)
                </label>
                <input
                  type="number"
                  value={trainPickupRate}
                  onChange={(e) => setTrainPickupRate(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-brand-cream/60 border text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Custom Hourly ($)
                </label>
                <input
                  type="number"
                  value={customTourHourly}
                  onChange={(e) => setCustomTourHourly(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-brand-cream/60 border text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  LKR Exchange Rate
                </label>
                <input
                  type="number"
                  value={exchangeRateLkr}
                  onChange={(e) => setExchangeRateLkr(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-brand-cream/60 border text-sm font-bold"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-brand-dark border-b border-brand-forest/10 pb-2">
              Social Media Profiles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-forest mb-1">
                  TripAdvisor URL
                </label>
                <input
                  type="url"
                  value={tripadvisorUrl}
                  onChange={(e) => setTripadvisorUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border text-sm"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-7 py-3.5 rounded-xl bg-brand-forest hover:bg-brand-deep text-white text-xs font-bold shadow-md flex items-center gap-2"
      >
        <Save className="w-4 h-4 text-brand-gold" />
        <span>{loading ? "Saving..." : "Save Changes to Database"}</span>
      </button>
    </form>
  );
}

