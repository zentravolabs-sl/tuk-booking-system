import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } }).catch(() => null);
  const title =
    settings?.seoTitle ||
    "Kavith Tuk Tuk Service | #1 Local Tours & Tuk Tuk Booking in Ella, Sri Lanka";
  const description =
    settings?.seoDescription ||
    "Discover breathtaking views, hidden waterfalls and unforgettable adventures with Kavith Tuk Tuk Service, Ella, Sri Lanka.";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    title: {
      default: title,
      template: "%s | Kavith Tuk Tuk Service"
    },
    description,
    keywords: settings?.seoKeywords || "Kavith Tuk Tuk Service, Ella Tuk Tuk, Ella Taxi Service, Nine Arch Bridge, Little Adams Peak, Diyaluma Falls",
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      siteName: "Kavith Tuk Tuk Service",
      images: [
        {
          url:
            settings?.heroBackgroundImage ||
            "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85",
          width: 1200,
          height: 630,
          alt: "Ella Tuk Tuk Taxi Service Sri Lanka"
        }
      ]
    },
    alternates: {
      canonical: "/"
    }
  };
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TravelAgency"],
    name: "Kavith Tuk Tuk Service",
    description:
      "Authentic local Tuk Tuk tours, Nine Arch Bridge excursions, waterfall adventures, and private transfers in Ella, Sri Lanka.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://ellatuktuktaxiservice.com",
    telephone: "0785089432",
    email: "Kavithsasalanka@gmail.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Street, Near Railway Station",
      addressLocality: "Ella",
      postalCode: "90090",
      addressCountry: "LK"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.8667,
      longitude: 81.0466
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      opens: "00:00",
      closes: "23:59"
    }
  };

  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-brand-cream text-brand-dark selection:bg-brand-gold selection:text-brand-deep min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: "14px",
              fontFamily: "var(--font-sans)"
            }
          }}
        />
      </body>
    </html>
  );
}

