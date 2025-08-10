import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://rx-vet.vercel.app/"),
  title: "Rex Vet - Your Trusted Online Veterinary Service",
  description:
    "Rex Vet offers reliable online veterinary consultations and support for your pets. Connect with experienced veterinarians from the comfort of your home.",
  keywords: [
    "online vet",
    "veterinary services",
    "pet health",
    "telemedicine for pets",
    "vet consultation",
  ],
  alternates: {
    canonical: "/",
  },
  authors: [
    {
      name: "Rex Vet",
      url: "https://rx-vet.vercel.app/",
    },
  ],
  publisher: "Rex Vet",
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Rex Vet - Your Trusted Online Veterinary Service",
    description:
      "Rex Vet offers reliable online veterinary consultations and support for your pets. Connect with experienced veterinarians from the comfort of your home.",
    url: "https://rx-vet.vercel.app/",
    type: "website",
    images: [
      {
        url: "/public/images/LogoR-BwtRiloc.webp",
        width: 800,
        height: 600,
        alt: "Rex Vet Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rex Vet - Your Trusted Online Veterinary Service",
    description:
      "Rex Vet offers reliable online veterinary consultations and support for your pets. Connect with experienced veterinarians from the comfort of your home.",
    images: ["/public/images/LogoR-BwtRiloc.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${garet.variable} antialiased`}
        suppressHydrationWarning
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
