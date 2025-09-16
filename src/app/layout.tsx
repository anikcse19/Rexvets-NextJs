export const dynamic = "force-dynamic";
export const revalidate = 0;

import GoogleAnalytics, {
  GoogleAnalyticsScript,
  GoogleTagManagerNoScript,
} from "@/components/GoogleAnalytics";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { sameAs, siteName, siteUrl } from "@/lib";
import RootLayoutProvider from "@/lib/Layoutes/RootLayoutProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import Loader from "@/components/shared/Loader";

const garet = localFont({
  src: [
    {
      path: "../../public/fonts/Garet-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Garet-Book.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Garet-Book.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Garet-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Garet-Heavy.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Garet-Heavy.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Garet-Heavy.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Garet-Heavy.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-garet",
});

const description =
  "RexVet | 24/7 Affordable Online Pet Telehealth from Home. Get instant veterinary care for your pets with licensed veterinarians. 501(c)(3) non-profit. Book your vet consultation now!";
const keywords = [
  "online vet",
  "pet telehealth",
  "veterinary care",
  "pet health",
  "telemedicine for pets",
  "virtual vet consultation",
  "affordable pet care",
  "24/7 vet service",
  "pet emergency care",
  "online veterinary consultation",
  "pet telemedicine",
  "veterinary telehealth",
  "pet health online",
  "virtual pet care",
  "online animal healthcare",
  "pet doctor online",
  "emergency vet online",
  "pet consultation",
  "veterinary services",
  "pet medical care",
  "online pet doctor",
  "virtual veterinary care",
  "pet health consultation",
  "telehealth for pets",
  "online pet health",
  "pet medical advice",
  "veterinary telemedicine",
  "pet care online",
  "online animal doctor",
  "pet health services",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RexVet | 24/7 Affordable Online Pet Telehealth from Home",
    template: `%s | ${siteName}`,
  },
  manifest: "/manifest.json",
  description,
  keywords,
  authors: [{ name: siteName, url: siteUrl }],
  publisher: siteName,
  creator: siteName,
  category: "Veterinary Services",
  classification: "Healthcare",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
    },
  },
  openGraph: {
    title: "RexVet | 24/7 Affordable Online Pet Telehealth from Home",
    description,
    url: siteUrl,
    type: "website",
    siteName,
    locale: "en_US",
    images: [
      {
        url: `${siteUrl}/images/Logo.svg`,
        width: 1200,
        height: 630,
        alt: "RexVet - 24/7 Online Pet Telehealth Service",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RexVet | 24/7 Affordable Online Pet Telehealth from Home",
    description,
    images: [`${siteUrl}/images/Logo.svg`],
    creator: "@RexVet",
    site: "@RexVet",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual Google verification code
    yandex: "your-yandex-verification-code", // Replace if needed
    yahoo: "your-yahoo-verification-code", // Replace if needed
  },
  other: {
    "google-site-verification": "your-google-verification-code", // Replace with actual code
    "msvalidate.01": "your-bing-verification-code", // Replace if needed
    "yandex-verification": "your-yandex-verification-code", // Replace if needed
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverSession = (await getServerSession(authOptions as any)) as any;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Canonical Link */}
        <link rel="canonical" href={siteUrl} />
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* PWA & Mobile Meta */}
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />

        {/* Enhanced SEO Meta Tags */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="author" content={siteName} />
        <meta
          name="copyright"
          content={`© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
        />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />

        {/* Social Media Meta Tags */}
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="RexVet | 24/7 Affordable Online Pet Telehealth from Home"
        />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={`${siteUrl}/images/Logo.svg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="RexVet - 24/7 Online Pet Telehealth Service"
        />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@RexVet" />
        <meta name="twitter:creator" content="@RexVet" />
        <meta
          name="twitter:title"
          content="RexVet | 24/7 Affordable Online Pet Telehealth from Home"
        />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}/images/Logo.svg`} />
        <meta
          name="twitter:image:alt"
          content="RexVet - 24/7 Online Pet Telehealth Service"
        />

        {/* Additional SEO Meta Tags */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Google Analytics Script */}
        <GoogleAnalyticsScript />

        {/* Enhanced JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: siteName,
                  url: siteUrl,
                  logo: {
                    "@type": "ImageObject",
                    url: `${siteUrl}/images/Logo.svg`,
                    width: 1200,
                    height: 630,
                  },
                  description: description,
                  foundingDate: "2024",
                  legalName: "RexVet",
                  taxID: "501(c)(3)",
                  nonprofitStatus: "NonProfit501c3",
                  sameAs: sameAs,
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      telephone: "+1-555-555-5555",
                      contactType: "Customer Service",
                      areaServed: "US",
                      availableLanguage: ["English"],
                      hoursAvailable: {
                        "@type": "OpeningHoursSpecification",
                        dayOfWeek: [
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ],
                        opens: "00:00",
                        closes: "23:59",
                      },
                    },
                    {
                      "@type": "ContactPoint",
                      contactType: "Emergency",
                      telephone: "+1-555-555-5555",
                      areaServed: "US",
                      availableLanguage: ["English"],
                      hoursAvailable: {
                        "@type": "OpeningHoursSpecification",
                        dayOfWeek: [
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ],
                        opens: "00:00",
                        closes: "23:59",
                      },
                    },
                  ],
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "US",
                    addressRegion: "United States",
                  },
                  areaServed: {
                    "@type": "Country",
                    name: "United States",
                  },
                  serviceArea: {
                    "@type": "Country",
                    name: "United States",
                  },
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Veterinary Services",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Online Veterinary Consultation",
                          description:
                            "24/7 virtual veterinary consultations for pets",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Emergency Pet Care",
                          description:
                            "Immediate online emergency veterinary care",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Prescription Services",
                          description:
                            "Online prescription and medication services for pets",
                        },
                      },
                    ],
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: "RexVet | 24/7 Affordable Online Pet Telehealth from Home",
                  description: description,
                  publisher: {
                    "@id": `${siteUrl}/#organization`,
                  },
                  potentialAction: [
                    {
                      "@type": "SearchAction",
                      target: {
                        "@type": "EntryPoint",
                        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
                      },
                      "query-input": "required name=search_term_string",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${garet.variable} antialiased`}
        suppressHydrationWarning
      >
        <RootLayoutProvider session={serverSession}>
          {/* Google Tag Manager NoScript */}
          <GoogleTagManagerNoScript />

          <Toaster richColors position="top-right" />

          {/* Performance Monitor */}
          <PerformanceMonitor session={serverSession}>
            {/* Google Analytics Provider */}
            <Suspense fallback={<Loader />}>
              <GoogleAnalytics>{children}</GoogleAnalytics>
            </Suspense>
          </PerformanceMonitor>
        </RootLayoutProvider>
      </body>
    </html>
  );
}
