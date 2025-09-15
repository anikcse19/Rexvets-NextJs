import FindVetPage from "@/components/FindVet/FindVetPage";
import { getAllVets } from "@/components/FindVet/Service/get-all-vets";

import { Metadata } from "next";
import React, { Suspense } from "react";

// Make this page dynamic to avoid build-time API calls
export const dynamic = "force-dynamic";

// SEO Metadata
export const metadata: Metadata = {
  title: "Find Veterinarians Near You | RexVet - Connect with Expert Pet Care",
  description:
    "Find qualified veterinarians in your area. Browse profiles, read reviews, and book appointments with experienced pet care professionals. Get expert veterinary care for your pets.",
  keywords: [
    "find veterinarian",
    "veterinarian near me",
    "pet doctor",
    "animal hospital",
    "veterinary care",
    "pet health",
    "veterinarian appointment",
    "pet medical care",
    "veterinary services",
    "pet specialist",
    "animal doctor",
    "veterinary clinic",
    "pet healthcare",
    "veterinarian search",
    "pet medical professional",
  ],
  openGraph: {
    title: "Find Veterinarians Near You | RexVet",
    description:
      "Connect with experienced veterinarians in your area. Browse profiles, read reviews, and book appointments with expert pet care professionals.",
    type: "website",
    url: "https://www.rexvet.org/find-a-vet",
    siteName: "RexVet",
    images: [
      {
        url: "/images/Homepage/vet-consultation.webp",
        width: 1200,
        height: 630,
        alt: "Veterinarian consultation with pet",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Veterinarians Near You | RexVet",
    description:
      "Connect with experienced veterinarians in your area. Browse profiles, read reviews, and book appointments.",
    images: ["/images/Homepage/vet-consultation.webp"],
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
  alternates: {
    canonical: "https://www.rexvet.org/find-a-vet",
  },
  category: "veterinary services",
};

// Structured Data for Veterinarian Search
const generateStructuredData = (veterinarians: any[]) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Veterinarians Near You",
    description:
      "List of qualified veterinarians available for pet care services",
    url: "https://www.rexvet.org/find-a-vet",
    numberOfItems: veterinarians?.length || 0,
    itemListElement:
      veterinarians?.map((vet: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Veterinary",
          "@id": `https://www.rexvet.org/find-a-vet/${vet._id}`,
          name: vet.name,
          description: `Veterinarian ${vet.name} specializing in ${
            vet.specialization || "pet care"
          }`,
          url: `https://www.rexvet.org/find-a-vet/${vet._id}`,
          telephone: vet.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: vet.address || "",
            addressLocality: vet.city || "",
            addressRegion: vet.state || "",
            addressCountry: vet.country || "Bangladesh",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: vet.latitude || "",
            longitude: vet.longitude || "",
          },
          areaServed: {
            "@type": "City",
            name: vet.city || "Bangladesh",
          },
          availableService: {
            "@type": "MedicalService",
            name: "Veterinary Care",
            description: "Comprehensive pet care and veterinary services",
          },
          image: vet.profileImage || "/images/Homepage/vet-consultation.webp",
          aggregateRating: vet.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: vet.rating,
                reviewCount: vet.reviewCount || 0,
              }
            : undefined,
        },
      })) || [],
  };

  return structuredData;
};

const page = async () => {
  try {
    const result = await getAllVets();

    const veterinarians = result?.data || [];
    const structuredData = generateStructuredData(veterinarians);

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.rexvet.org",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Find Veterinarians",
                  item: "https://www.rexvet.org/find-a-vet",
                },
              ],
            }),
          }}
        />

        {/* Local Business Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Veterinary",
              name: "RexVet",
              description:
                "Connect with qualified veterinarians for expert pet care services",
              url: "https://www.rexvet.org",
              telephone: "+880-XXX-XXX-XXXX",
              address: {
                "@type": "PostalAddress",
                addressCountry: "Bangladesh",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "23.8103",
                longitude: "90.4125",
              },
              areaServed: {
                "@type": "Country",
                name: "Bangladesh",
              },
              availableService: {
                "@type": "MedicalService",
                name: "Veterinary Care",
                description: "Comprehensive pet care and veterinary services",
              },
              sameAs: [
                "https://www.facebook.com/rexvet",
                "https://www.instagram.com/rexvet",
                "https://www.linkedin.com/company/rexvet",
              ],
            }),
          }}
        />

        <div>
          {/* <Suspense> */}
          <FindVetPage doctors={result?.data} />
          {/* </Suspense> */}
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching veterinarians:", error);
    // Return empty data if API fails
    return (
      <>
        {/* Structured Data for empty state */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData([])),
          }}
        />

        <div>
          {/* <Suspense> */}
          <FindVetPage
            doctors={{
              veterinarians: [],
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                pages: 0,
              },
            }}
          />
          {/* </Suspense> */}
        </div>
      </>
    );
  }
};

export default page;
