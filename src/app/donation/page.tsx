// import { Donation } from "@/components/Donate";
import { siteName, siteUrl } from "@/lib";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";
const Donation = dynamic(
  () => import("@/components/Donate").then((mod) => mod.Donate),
  {
    loading: () => <p>Loading donation page...</p>,
  }
);
export const metadata: Metadata = {
  title: `Donate to Support ${siteName} | Help Us Care for Pets`,
  description: `Contribute to ${siteName}'s mission to provide reliable online veterinary consultations and support for pets. Your donations help improve pet healthcare services worldwide.`,
  keywords: [
    "donate to vet",
    "pet donations",
    "online veterinary donation",
    "support ${siteName}",
    "veterinary services donation",
    "animal welfare donation",
    "pet healthcare support",
  ],
  authors: [{ name: `${siteName}`, url: siteUrl }],
  publisher: `${siteName}`,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/donate`,
  },
  openGraph: {
    title: `Donate to Support ${siteName} | Help Us Care for Pets`,
    description: `Support ${siteName} with your donations to help provide reliable veterinary care and improve pet health worldwide.`,
    url: `${siteUrl}/donate`,
    siteName: `${siteName}`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/images/donate-page/vet.webp`,
        width: 1200,
        height: 630,
        alt: "Donate to ${siteName} - Help Us Care for Pets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@RexVetOfficial",
    title: `Donate to Support ${siteName} | Help Us Care for Pets`,
    description: `Contribute to ${siteName}'s mission to provide reliable online veterinary consultations and support for pets.`,
    images: [`${siteUrl}/images/donate-page/vet.webp`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

const DonatePage = () => {
  return (
    <div className="">
      <Donation />
    </div>
  );
};

export default DonatePage;
