import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const isAnalyze = process.env.ANALYZE === "true";
const isProd = process.env.NODE_ENV === "production";

// Setup PWA
const withPWA = withPWAInit({
  dest: "public",
  disable: !isProd,
  register: true,
  skipWaiting: true,
});

// Base Next.js config
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "widgets.guidestar.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "images.pexels.com" }, // <-- Add this
    ],
  },
};

// Combine plugins
export default withBundleAnalyzer({ enabled: isAnalyze })(
  withPWA(nextConfig as any) as any
);
