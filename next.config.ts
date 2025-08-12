import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const isAnalyze = process.env.ANALYZE === "true";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "widgets.guidestar.org",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
};

export default withBundleAnalyzer({
  enabled: isAnalyze,
})(nextConfig);
