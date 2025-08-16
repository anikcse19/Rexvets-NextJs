"use client";
import { Badge } from "@/components/ui/badge";
import { IBlog } from "@/lib";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  IoArrowForward,
  IoCalendarOutline,
  IoPersonOutline,
} from "react-icons/io5";

interface BlogPostSectionCard {
  blog: IBlog;
  index: number;
}

const BlogPostSectionCard: React.FC<BlogPostSectionCard> = ({
  blog,
  index,
}) => {
  // Framer Motion variants for card animations
  const cardVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  };

  // Framer Motion variants for image
  const imageVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  // Framer Motion variants for read more
  const readMoreVariants: Variants = {
    initial: { opacity: 0, x: -10 },
    hover: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className="h-full"
    >
      <Link href={`/blog/${blog.slug}`} className="no-underline">
        <div className="relative flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-xl">
          {/* Featured Badge */}
          {index === 0 && (
            <Badge className="absolute top-4 left-4 z-10 bg-blue-500 text-white font-semibold text-xs rounded-full py-2 px-5 ">
              Featured
            </Badge>
          )}

          {/* Blog Image */}
          <div className="relative h-60 overflow-hidden">
            <motion.div variants={imageVariants}>
              <Image
                src={blog.mainImage}
                alt={blog.title}
                width={400}
                height={240}
                priority={index === 0}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Blog Content */}
          <div className="flex-1 flex flex-col p-6">
            {/* Date and Author */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <IoCalendarOutline className="text-gray-600 text-sm" />
                <span className="text-gray-600 text-sm font-medium">
                  {blog.date}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <IoPersonOutline className="text-gray-600 text-sm" />
                <span className="text-gray-600 text-sm font-medium">
                  {blog.by}
                </span>
              </div>
            </div>

            {/* Blog Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-3 flex-1">
              {blog.title}
            </h3>

            {/* Read More */}
            <motion.div
              variants={readMoreVariants}
              className="flex items-center gap-2 text-blue-500 font-semibold text-sm"
            >
              <span>Read More</span>
              <IoArrowForward className="text-sm" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(BlogPostSectionCard);
