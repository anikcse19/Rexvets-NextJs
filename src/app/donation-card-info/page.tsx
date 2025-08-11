import { DonationCardInfo } from "@/components/Donate";
import { siteName, siteUrl } from "@/lib";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Donate Securely Online | ${siteName}`,
  description: `Make a secure online donation to ${siteName} using our trusted payment gateway. Support pet healthcare and veterinary services easily and safely.`,
  keywords: [
    "secure donation",
    "online payment",
    "stripe donation",
    "veterinary donation",
    "support pet care",
    `${siteName} donation`,
    "donate online",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/donation-card-info`,
  },
  openGraph: {
    title: `Donate Securely Online | ${siteName}`,
    description: `Support ${siteName} by making a safe and secure online donation using Stripe. Help us provide quality veterinary care for pets.`,
    url: `${siteUrl}/donation-card-info`,
    siteName: siteName,
    type: "website",
    images: [
      {
        url: `${siteUrl}/images/donate-page/vet.webp`,
        width: 1200,
        height: 630,
        alt: `Secure Online Donation Payment at ${siteName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@RexVetOfficial", //replace with actual handler
    title: `Donate Securely Online | ${siteName}`,
    description: `Make a secure online donation to ${siteName} using Stripe. Support pet health with trusted veterinary services.`,
    images: [`${siteUrl}/images/donate-page/vet.webp`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

const DonationCardInfoPage = () => {
  return (
    <div>
      <DonationCardInfo />
    </div>
  );
};

export default DonationCardInfoPage;
