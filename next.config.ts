import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const isAnalyze = process.env.ANALYZE === "true";

// Base Next.js config
const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "widgets.guidestar.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

// Combine plugins
export default withBundleAnalyzer({ enabled: isAnalyze })(nextConfig as any);
