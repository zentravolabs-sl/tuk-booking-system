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
  title: "Register Customer Account with Email OTP | Kavith Tuk Tuk Service",
  description:
    "Create your customer account using your email address and verify via 6-digit OTP to view and manage your tour package and ride bookings."
};

export default async function CustomerRegisterPage() {
  const customer = await getCurrentCustomer();
  if (customer) {
    redirect("/dashboard");
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" }
  });

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar phone={settings?.phone} />

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center">
        <div className="w-full">
          <CustomerAuthClient initialMode="register" />
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}

