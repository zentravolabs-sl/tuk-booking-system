import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomerAuthClient } from "@/components/customer/CustomerAuthClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer Login & Registration | Kavith Tuk Tuk Service Ella",
  description:
    "Sign in to your customer dashboard or register with email OTP verification to view your Ella Tuk Tuk tour packages, ride bookings, and driver details."
};

export default async function CustomerLoginPage({
  searchParams
}: {
  searchParams?: { mode?: string };
}) {
  const customer = await getCurrentCustomer();
  if (customer) {
    redirect("/dashboard");
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" }
  });

  const initialMode =
    searchParams?.mode === "register" ? "register" : "login";

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar phone={settings?.phone} />

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center">
        <div className="w-full">
          <CustomerAuthClient initialMode={initialMode} />
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}

