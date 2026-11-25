import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DiscountType } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function calculateFinalPrice(
  price: number,
  discountType: DiscountType | string,
  discountValue: number
): number {
  if (!discountValue || discountValue <= 0 || discountType === "NONE") {
    return Number(price.toFixed(2));
  }
  if (discountType === "PERCENTAGE") {
    const discounted = price - (price * Math.min(discountValue, 95)) / 100;
    return Number(Math.max(0, discounted).toFixed(2));
  }
  if (discountType === "FIXED") {
    return Number(Math.max(0, price - discountValue).toFixed(2));
  }
  return Number(price.toFixed(2));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `ELLA-${year}-${digits}`;
}

export function sanitizeText(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim();
}

