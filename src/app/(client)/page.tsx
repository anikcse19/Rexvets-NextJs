import { siteName, siteUrl } from "@/lib";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";
import SessionDebugger from "@/components/SessionDebugger";

// SEO Metadata for Home Page
export const metadata: Metadata = {
  title: "RexVet | 24/7 Affordable Online Pet Telehealth from Home",
  description: "Get 24/7 online pet telehealth with RexVet. Affordable online veterinary care from your home, trusted by pet owners. 501(c)(3) non-profit. Book your vet now!",
  keywords: [
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
    "online animal healthcare"
  ],
  openGraph: {
    title: "RexVet | 24/7 Affordable Online Pet Telehealth from Home",
    description: "Get 24/7 online pet telehealth with RexVet. Affordable online veterinary care from your home, trusted by pet owners. 501(c)(3) non-profit. Book your vet now!",
    url: siteUrl,
    type: "website",
    siteName: siteName,
    images: [
      {
        url: `${siteUrl}/images/Logo.svg`,
        width: 1200,
        height: 630,
        alt: "RexVet - Online Pet Telehealth Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RexVet | 24/7 Affordable Online Pet Telehealth from Home",
    description: "Get 24/7 online pet telehealth with RexVet. Affordable online veterinary care from your home, trusted by pet owners. 501(c)(3) non-profit. Book your vet now!",
    images: [`${siteUrl}/images/Logo.svg`],
    creator: "@RexVet",
  },
  alternates: {
    canonical: siteUrl,
  },
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
};

const Home = dynamic(
  () => import("@/components/Home").then((mod) => mod.Home),
  {
    loading: () => (
      <div className="">
        <p>Loading Home page...</p>
      </div>
    ),
  }
);

const page = () => {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                "url": siteUrl,
                "name": "RexVet | 24/7 Affordable Online Pet Telehealth from Home",
                "potentialAction": [
                  {
                    "@type": "SearchAction",
                    "target": `${siteUrl}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                  }
                ]
              },
              {
                "@type": "WebPage",
                "@id": `${siteUrl}/#webpage`,
                "url": siteUrl,
                "inLanguage": "en",
                "name": "RexVet | 24/7 Affordable Online Pet Telehealth from Home",
                "isPartOf": {
                  "@id": `${siteUrl}/#website`
                },
                "description": "Get 24/7 online pet telehealth with RexVet. Affordable online veterinary care from your home, trusted by pet owners. 501(c)(3) non-profit. Book your vet now!",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": siteUrl
                    }
                  ]
                }
              },
              {
                "@type": "Veterinary",
                "@id": `${siteUrl}/#organization`,
                "name": "RexVet",
                "url": siteUrl,
                "logo": `${siteUrl}/images/Logo.svg`,
                "description": "RexVet is a 501(c)(3) non-profit organization providing 24/7 affordable online pet telehealth services. Connect with licensed veterinarians from the comfort of your home for comprehensive pet care.",
                "telephone": "+1-555-555-5555",
                "email": "info@rexvet.org",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "US"
                },
                "serviceType": [
                  "Online Veterinary Consultation",
                  "Pet Telehealth",
                  "Emergency Pet Care",
                  "Pet Health Advice",
                  "Prescription Services"
                ],
                "availableService": [
                  {
                    "@type": "Service",
                    "name": "Online Veterinary Consultation",
                    "description": "24/7 virtual veterinary consultations for pets"
                  },
                  {
                    "@type": "Service", 
                    "name": "Emergency Pet Care",
                    "description": "Immediate online emergency veterinary care"
                  },
                  {
                    "@type": "Service",
                    "name": "Prescription Services", 
                    "description": "Online prescription and medication services for pets"
                  }
                ],
                "areaServed": "United States",
                "priceRange": "$$",
                "paymentAccepted": [
                  "Credit Card",
                  "Debit Card",
                  "Insurance"
                ],
                "openingHours": "Mo-Su 00:00-23:59",
                "sameAs": [
                  "https://facebook.com/RexVet",
                  "https://instagram.com/RexVet", 
                  "https://twitter.com/RexVet"
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is RexVet?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "RexVet is a 501(c)(3) non-profit organization providing 24/7 affordable online pet telehealth services. We connect pet owners with licensed veterinarians for virtual consultations from the comfort of home."
                    }
                  },
                  {
                    "@type": "Question", 
                    "name": "How much does RexVet cost?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "RexVet offers affordable online veterinary care with transparent pricing. Our consultation fees are significantly lower than traditional in-person vet visits, making quality pet care accessible to everyone."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is RexVet available 24/7?",
                    "acceptedAnswer": {
                      "@type": "Answer", 
                      "text": "Yes, RexVet provides 24/7 online veterinary services. You can connect with licensed veterinarians anytime, day or night, for emergency care or routine consultations."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
      
      <Home />
      <SessionDebugger />
    </>
  );
};

export default page;
