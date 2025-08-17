"use client";
import { BlogsData } from "@/lib";
import { BookOpen, User } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";

const RexHealthHubHeroSection = dynamic(
  () => import("./RexHealthHubHeroSection"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
const RexHealthHubCtaSection = dynamic(
  () => import("./RexHealthHubCtaSection"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
const RexHealthHubBlogSection = dynamic(
  () => import("./RexHealthHubBlogSection"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
const RexHealthHub = () => {
  const stats = [
    {
      label: "Articles",
      value: BlogsData.length,
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
    },
    {
      label: "Authors",
      value: "5+",
      icon: <User className="w-8 h-8 text-purple-600" />,
    },
  ];
  return (
    <div id="RexHealthHub">
      <RexHealthHubHeroSection
        title="Blogs"
        description="Discover expert insights, tips, and stories about pet care and veterinary health"
        stats={stats}
      />
      <RexHealthHubBlogSection blogs={BlogsData} />
      <br />
      <RexHealthHubCtaSection
        title="Stay Updated"
        description="Don't miss out on the latest pet care tips and veterinary insights. Follow our blog for regular updates."
        tags={[
          "Pet Health",
          "Veterinary Care",
          "Wellness Tips",
          "Expert Advice",
        ]}
      />
    </div>
  );
};

export default React.memo(RexHealthHub);
