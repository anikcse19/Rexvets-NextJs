import { WhatWeTreat } from "@/components/WhatWeTreat";
import { siteName, siteUrl } from "@/lib";
import type { Metadata } from "next";
import React from "react";

const pageUrl = `${siteUrl}/what-we-treat`;
const title = "What We Treat - Comprehensive Pet Care Services";
const description =
  "Discover the full range of pet health conditions we treat at Rex Vet. From preventive care to urgent consultations, our experienced veterinarians are here to help your pet thrive.";

export const metadata: Metadata = {
  title: `${title} | ${siteName}`,
  description,
  keywords: [
    "pet treatment",
    "veterinary conditions",
    "pet illnesses",
    "online vet services",
    "dog care",
    "cat care",
    "pet health treatments",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title,
    description,
    url: pageUrl,
    siteName,
    type: "article",
    images: [
      {
        url: `${siteUrl}/images/what-we-treat/mission.webp`,
        width: 1200,
        height: 630,
        alt: "Rex Vet - What We Treat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/images/what-we-treat/mission.webp`],
  },
};

const WhatWeTreatPage = () => {
  return (
    <div>
      <WhatWeTreat />
    </div>
  );
};

export default WhatWeTreatPage;
