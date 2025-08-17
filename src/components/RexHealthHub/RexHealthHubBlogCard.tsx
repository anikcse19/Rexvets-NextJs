"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { rexHealthHubCardHover } from "./animation.config";
import { IRexHealthHubBlogCardProps } from "./interface";

const RexHealthHubBlogCard: React.FC<IRexHealthHubBlogCardProps> = ({
  slug,
  mainImage,
  title,
  date,
  by,
  excerpt,
}) => (
  <Link href={`/blog/${slug}`} className="no-underline block">
    <motion.div
      variants={rexHealthHubCardHover}
      initial="initial"
      whileHover="hover"
      className="h-full rounded-3xl overflow-hidden border border-white/20 bg-white/95 backdrop-blur-xl shadow-lg will-change-transform"
    >
      <div className="relative">
        <Image
          src={mainImage}
          alt={title}
          width={400}
          height={280}
          className="w-full h-72 object-cover transition-transform duration-600 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 z-0"></div>
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 text-xs font-semibold text-gray-900 flex items-center gap-1 z-10">
          <Calendar className="w-4 h-4 text-blue-600" />
          {date}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4 gap-2">
          <div className="bg-blue-100/50 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold text-blue-600 flex items-center gap-1">
            <User className="w-4 h-4 text-blue-600" />
            {by}
          </div>
          <div className="border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-600 flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-600" />5 min read
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {excerpt ||
            "Discover valuable insights and expert advice on pet care, health, and wellness in this comprehensive article."}
        </p>
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
          <span>Read More</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
        </div>
      </div>
    </motion.div>
  </Link>
);
export default React.memo(RexHealthHubBlogCard);
