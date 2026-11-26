import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomerDashboardClient } from "@/components/customer/CustomerDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Customer Dashboard | Tour Package & Ride Details | Kavith Tuk Tuk",
  description:
    "View your booked Ella Tuk Tuk tour packages, local ride details, itinerary stops, and assigned driver status."
};

export default async function CustomerDashboardPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  const [settings, bookings, ridesCatalog] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.booking.findMany({
      where: {
        OR: [
          { customerId: customer.id },
          {
            customerEmail: {
              equals: customer.email,
              mode: "insensitive"
            }
          }
        ]
      },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            slug: true,
            shortDescription: true,
            coverImage: true,
            distance: true,
            travelTime: true,
            includedServices: true
          }
        },
        tourPackage: {
          select: {
            id: true,
            name: true,
            slug: true,
            tagline: true,
            shortDescription: true,
            coverImage: true,
            duration: true,
            startTime: true,
            endTime: true,
            itinerary: true,
            inclusions: true,
            destinations: {
              include: {
                destination: {
                  select: {
                    id: true,
                    name: true,
                    coverImage: true,
                    distance: true
                  }
                }
              },
              orderBy: { stopOrder: "asc" }
            }
          }
        },
        items: true
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.ride.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" }
    })
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar
        phone={settings?.phone}
        initialCustomer={{
          id: customer.id,
          fullName: customer.fullName,
          email: customer.email
        }}
      />

      <main className="py-10 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <CustomerDashboardClient
          customer={{
            id: customer.id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            country: customer.country,
            createdAt: customer.createdAt.toISOString()
          }}
          bookings={bookings}
          ridesCatalog={ridesCatalog}
          whatsappNumber={settings?.whatsapp || "+94785089432"}
        />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
