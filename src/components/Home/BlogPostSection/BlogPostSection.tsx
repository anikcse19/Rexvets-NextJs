"use client";
import { BlogsData, IBlog } from "@/lib";
import React from "react";

import BlogPostEmptySection from "./BlogPostEmptySection";
import BlogPostSectionCard from "./BlogPostSectionCard";
import BlogPostSectionHeader from "./BlogPostSectionHeader";

interface BlogsPageProps {
  blogs?: IBlog[];
}

const BlogPostSection: React.FC<BlogsPageProps> = ({ blogs = BlogsData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-11">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogPostSectionHeader
          title="Latest Blog"
          description="Discover insights, tips, and stories from our veterinary experts"
        />
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs?.map((blog, index) => (
              <BlogPostSectionCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>
        ) : (
          <BlogPostEmptySection />
        )}
      </div>
    </div>
  );
};

export default React.memo(BlogPostSection);
