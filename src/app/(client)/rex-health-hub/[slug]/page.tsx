"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { BlogsData } from "@/lib";
import Link from "next/link";

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const blog = BlogsData.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold text-gray-700">
        Blog not found ❌
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[400px] md:h-[500px]"
      >
        <Image
          src={blog.mainImage}
          alt={blog.title}
          fill
          className="object-cover rounded-b-2xl shadow-xl"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-6">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold drop-shadow-lg"
          >
            {blog.title}
          </motion.h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200">
            By <span className="font-semibold">{blog.by}</span> • {blog.date}
          </p>
        </div>
      </motion.div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {blog.description.map((block, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {block.titleBig && (
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-800">
                {block.titleBig}
              </h2>
            )}
            {block.title && (
              <h3 className="text-xl font-semibold text-indigo-600">
                {block.title}
              </h3>
            )}
            {block.paragraph && (
              <p className="text-gray-700 leading-relaxed text-lg">
                {block.paragraph.split("[BR]").map((line, i) => (
                  <span key={i} className="block mb-2">
                    {line}
                  </span>
                ))}
              </p>
            )}
            {block.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg"
              >
                <Image
                  src={block.image}
                  alt="Blog image"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Call to Action Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-indigo-600 text-white py-10 text-center px-6 flex flex-col gap-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold">
          Loved this article? 🐾
        </h2>
        <p className=" text-lg text-indigo-100">
          Stay updated with more pet care tips and stories.
        </p>
        <div>
          <Link
            href="/rex-health-hub"
            className=" inline px-6 py-3 bg-white text-indigo-700 cursor-pointer font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-transform"
          >
            Explore More Blogs
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
