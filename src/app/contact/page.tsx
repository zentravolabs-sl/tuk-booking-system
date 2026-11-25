import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactFormClient } from "@/components/tourism/ContactFormClient";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Ella Tuk Tuk Taxi Service | 24/7 WhatsApp & Ella Railway Desk",
  description:
    "Get in touch with Ella Tuk Tuk Taxi Service in Ella, Sri Lanka. 24/7 WhatsApp support, phone bookings, and custom highland tour inquiries."
};

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const phone = settings?.phone || "0785089432";
  const whatsapp = (settings?.whatsapp || "+94785089432").replace(/[^0-9]/g, "");
  const email = settings?.email || "Kavithsasalanka@gmail.com";
  const address =
    settings?.address || "Main Street, Near Railway Station, Ella 90090, Sri Lanka";

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar phone={phone} />

      <section className="bg-brand-deep text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-gold bg-white/10 px-3.5 py-1.5 rounded-full">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>24/7 Ella Highland Dispatch</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-3">
            Contact Our Local Team
          </h1>
          <p className="text-brand-cream/85 text-sm sm:text-base mt-3 max-w-2xl">
            Whether you need an urgent pickup from Ella Railway Station or want help
            planning a multi-day highland itinerary, we&apos;re here 24/7.
          </p>
        </div>
      </section>

      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Info Cards */}
        <div className="space-y-5">
          <div className="bg-brand-forest text-white rounded-3xl p-6 shadow-premium">
            <MessageCircle className="w-8 h-8 text-brand-gold mb-3" />
            <h3 className="font-serif text-xl font-bold">Instant WhatsApp Desk</h3>
            <p className="text-xs text-brand-cream/80 mt-1">
              Fastest response for same-day rides & train arrival coordination.
            </p>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block bg-brand-gold text-brand-deep font-extrabold text-xs px-5 py-3 rounded-xl"
            >
              Chat on WhatsApp: {phone}
            </a>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-brand-forest/15 shadow-card space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-brand-dark">Main Ella Stand</p>
                <p className="text-xs text-brand-dark/70 mt-0.5">{address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-brand-dark">24/7 Direct Hotline</p>
                <a href={`tel:${phone}`} className="text-xs text-brand-forest font-semibold">
                  {phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-brand-dark">Email Reservations</p>
                <a href={`mailto:${email}`} className="text-xs text-brand-forest font-semibold">
                  {email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-brand-forest shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-brand-dark">Operating Hours</p>
                <p className="text-xs text-brand-dark/70 mt-0.5">
                  Open 24 Hours Daily (Including 5:00 AM Sunrise Tours)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Contact Form */}
        <div className="lg:col-span-2">
          <ContactFormClient />
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}

