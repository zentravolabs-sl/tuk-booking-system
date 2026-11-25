"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { submitContactMessageAction } from "@/app/actions/booking-actions";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactFormClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitContactMessageAction({
        name,
        email,
        phone,
        subject,
        message
      });
      if (!res.success) {
        toast.error(res.error || "Could not send message.");
      } else {
        setSent(true);
        toast.success("Message received! Our Ella team will reply shortly.");
      }
    } catch {
      toast.error("Unable to send message right now.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-brand-forest/20 shadow-premium text-center">
        <CheckCircle2 className="w-14 h-14 text-brand-forest mx-auto mb-4" />
        <h3 className="font-serif text-2xl font-bold text-brand-dark">
          Ayubowan! We&apos;ve Received Your Inquiry
        </h3>
        <p className="text-sm text-brand-dark/75 mt-2 max-w-md mx-auto">
          Thank you for contacting Ella Tuk Tuk Taxi Service. Our local dispatch team
          will reply to <strong>{email}</strong> shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setSubject("");
            setMessage("");
          }}
          className="mt-6 px-6 py-2.5 rounded-full bg-brand-forest text-white text-xs font-bold"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-7 sm:p-9 border border-brand-forest/15 shadow-premium space-y-5"
    >
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-dark">
          Send a Message to Our Ella Dispatch Desk
        </h2>
        <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
          Ask about custom itineraries, group bookings, train station pickups, or long-distance transfers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
            Phone / WhatsApp Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+44 7700 900412"
            className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
            Subject *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Custom Sunrise Tour / Group of 6"
            className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
          Your Message *
        </label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can our Ella Tuk Tuk team help plan your stay?"
          className="w-full px-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-forest hover:bg-brand-deep text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4 text-brand-gold" />
        <span>{loading ? "Sending Inquiry..." : "Send Message"}</span>
      </button>
    </form>
  );
}

