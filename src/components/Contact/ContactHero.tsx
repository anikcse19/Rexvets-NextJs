"use client";
import { Badge } from "@/components/ui/badge";
import { motion, Variants } from "framer-motion";
import React from "react";

const heroVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const badgeChildVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ContactHero = () => {
  const tags = [
    "24/7 Support",
    "Quick Response",
    "Expert Help",
    "Always Available",
  ];

  return (
    <section
      className="relative min-h-[60vh] flex items-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(139, 92, 246, 0.9) 50%, rgba(6, 182, 212, 0.9) 100%), url('/images/contact-bg.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08)_0%,transparent_50%),radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.1)_0%,transparent_50%)] pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div variants={heroVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-md">
              Touch
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Have questions about our telehealth services? Need support?
            We&apos;re here to help you and your pets get the care you deserve.
          </p>
          <motion.div
            variants={badgeVariants}
            className="flex justify-center gap-2 flex-wrap"
          >
            {tags.map((tag, index) => (
              <motion.div key={index} variants={badgeChildVariants}>
                <Badge className="bg-white/20 text-white border border-white/30 font-semibold px-3 py-1">
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
export default React.memo(ContactHero);
