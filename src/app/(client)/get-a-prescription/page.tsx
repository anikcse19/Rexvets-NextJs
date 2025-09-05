import Loader from "@/components/shared/Loader";
import { sameAs, siteName, siteUrl } from "@/lib";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

const loader = () => <Loader size={60} />;

const GetAPrescription = dynamic(
  () =>
    import("@/components/GetAPrescription").then((mod) => mod.GetAPrescription),
  {
    loading: loader,
  }
);

export const metadata = {
  title: "Get a Prescription Online | Fast & Reliable Medical Advice",
  description:
    "Easily get a prescription online from licensed doctors. Fast, secure, and reliable medical consultation and prescription service.",
  keywords: [
    "online prescription",
    "medical consultation",
    "get prescription online",
    "telemedicine",
    "online doctor",
  ],
  authors: [{ name: siteName }],
  openGraph: {
    title: "Get a Prescription Online | Fast & Reliable Medical Advice",
    description:
      "Easily get a prescription online from licensed doctors. Fast, secure, and reliable medical consultation and prescription service.",
    url: `${siteUrl}/get-a-prescription`,
    siteName: siteName,
    images: [
      {
        url: `${siteUrl}/images/og-image-prescription.jpg`,
        width: 800,
        height: 600,
        alt: "Get a Prescription Online",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get a Prescription Online | Fast & Reliable Medical Advice",
    description:
      "Easily get a prescription online from licensed doctors. Fast, secure, and reliable medical consultation and prescription service.",
    site: "@YourTwitterHandle", // update accordingly or import
    images: [`${siteUrl}/images/twitter-image-prescription.jpg`],
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/get-a-prescription",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: "Your Company Name", // update if needed or import from lib
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-555-1234",
    contactType: "customer service",
    areaServed: "US",
  },
  sameAs,
};

const GetAPrescriptionPage = () => {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          key="medicalorganization-jsonld"
        />
      </Head>
      <div>
        <GetAPrescription />
      </div>
    </>
  );
};

export default GetAPrescriptionPage;
