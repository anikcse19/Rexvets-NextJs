import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "widgets.guidestar.org",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // from earlier
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com", // if you use it
      },
    ],
  },
};

export default nextConfig;
