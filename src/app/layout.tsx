import { sameAs, siteName, siteUrl } from "@/lib";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  "Rex Vet offers reliable online veterinary consultations and support for your pets. Connect with experienced veterinarians from the comfort of your home.";
const keywords = [
  "online vet",
  "veterinary services",
  "pet health",
  "telemedicine for pets",
  "vet consultation",
  "virtual vet",
  "animal healthcare online",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Your Trusted Online Veterinary Service`,
    template: `%s | ${siteName}`,
  },
  manifest: "/manifest.json",
  description,
  keywords,
  authors: [{ name: siteName, url: siteUrl }],
  publisher: siteName,
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  openGraph: {
    title: `${siteName} - Your Trusted Online Veterinary Service`,
    description,
    url: siteUrl,
    type: "website",
    siteName,
    images: [
      {
        url: `${siteUrl}/images/Logo.svg`,
        width: 1200,
        height: 630,
        alt: `${siteName} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Your Trusted Online Veterinary Service`,
    description,
    images: [`${siteUrl}/images/Logo.svg`],
    creator: "@RexVet", // Replace with  Twitter handle
  },
  icons: {
    icon: "/favicon.ico", // new favicon
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteName,
              url: siteUrl,
              logo: `${siteUrl}/images/Logo.svg`,
              description,
              sameAs,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-555-5555",
                contactType: "Customer Service",
                areaServed: "Global",
                availableLanguage: ["English"],
              },
            }),
          }}
        />
      </head>
      <body
        className={`${garet.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
