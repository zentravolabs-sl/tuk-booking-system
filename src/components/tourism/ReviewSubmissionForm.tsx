"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { submitCustomerReviewAction } from "@/app/actions/booking-actions";
import { Star, Send, CheckCircle2 } from "lucide-react";

export function ReviewSubmissionForm() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [tourTitle, setTourTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitCustomerReviewAction({
        customerName,
        customerEmail,
        country,
        rating,
        title,
        comment,
        bookingReference,
        tourTitle
      });
      if (!res.success) {
        toast.error(res.error || "Could not submit review.");
      } else {
        setSubmitted(true);
        toast.success("Thank you! Your review has been submitted for approval.");
      }
    } catch {
      toast.error("Unable to submit review right now.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-brand-forest/20 text-center shadow-card">
        <CheckCircle2 className="w-12 h-12 text-brand-forest mx-auto mb-3" />
        <h3 className="font-serif text-2xl font-bold text-brand-dark">
          Bohoma Sthuthi! Thank You for Your Review
        </h3>
        <p className="text-sm text-brand-dark/70 mt-2 max-w-md mx-auto">
          Your review has been received by our Ella hospitality team and will appear
          publicly once verified.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-forest/15 shadow-premium space-y-5"
    >
      <div>
        <h3 className="font-serif text-2xl font-bold text-brand-dark">
          Rode With Us Recently? Share Your Experience
        </h3>
        <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
          Your feedback helps fellow travelers discover authentic local drivers in Ella.
        </p>
      </div>

      {/* Star Rating Picker */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
          Your Overall Rating *
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className="p-1.5 rounded-lg hover:bg-brand-cream transition"
            >
              <Star
                className={`w-6 h-6 ${
                  num <= rating
                    ? "fill-brand-gold text-brand-gold"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="text-xs font-bold text-brand-forest ml-2">
            {rating} / 5 Stars
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1">
            Your Name *
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g., Liam & Sophie"
            className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1">
            Country *
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g., United Kingdom"
            className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1">
            Tour / Destination Visited
          </label>
          <input
            type="text"
            value={tourTitle}
            onChange={(e) => setTourTitle(e.target.value)}
            placeholder="e.g., Nine Arch Bridge & Diyaluma Falls"
            className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1">
            Booking Reference (Optional)
          </label>
          <input
            type="text"
            value={bookingReference}
            onChange={(e) => setBookingReference(e.target.value.toUpperCase())}
            placeholder="ELLA-2026-XXXXXX"
            className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm font-mono uppercase"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1">
          Review Headline *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Unforgettable Sunrise at Lipton's Seat!"
          className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1">
          Your Review *
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell future travelers about your driver, the views, and your experience..."
          className="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3.5 rounded-xl bg-brand-forest hover:bg-brand-deep text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
      >
        <Send className="w-4 h-4 text-brand-gold" />
        <span>{loading ? "Submitting..." : "Submit Guest Review"}</span>
      </button>
    </form>
  );
}

