"use client";
import React from "react";
import { IRexHealthHubBlogCardProps } from "./interface";
import RexHealthHubBlogCard from "./RexHealthHubBlogCard";

interface BlogSectionProps {
  blogs: IRexHealthHubBlogCardProps[];
}

const RexHealthHubBlogSection: React.FC<BlogSectionProps> = ({ blogs }) => (
  <section
    className="relative min-h-screen py-8 md:py-12 bg-cover bg-bottom bg-fixed overflow-hidden"
    style={{
      backgroundImage: `linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)`,
    }}
  >
    <div className="absolute inset-0 bg-gray-50/95 backdrop-blur-sm pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-[48px] leading-[58px] font-extrabold text-gray-900 mb-3">
          Latest Articles
        </h2>
        <p className="text-base md:text-[20px] leading-[32px] mt-4 text-gray-600 max-w-xl mx-auto ">
          Stay informed with our latest insights on pet health, veterinary care,
          and wellness tips
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mt-4"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <RexHealthHubBlogCard key={index} {...blog} />
        ))}
      </div>
    </div>
  </section>
);
export default React.memo(RexHealthHubBlogSection);
