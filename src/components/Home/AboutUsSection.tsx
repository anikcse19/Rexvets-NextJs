"use client";
import { IFeature, IHomeAboutSectionFooter } from "@/lib";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import React from "react";

interface AboutUsSectionProps {
  features: IFeature[];
  footer: IHomeAboutSectionFooter;
}

const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  features = [],
  footer,
}) => {
  const { title, tabs } = footer;
  // Framer Motion variants for card hover
  const cardVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      boxShadow: "0 4px 24px rgba(148, 163, 184, 0.08)",
      border: "1px solid #e2e8f0",
    },
    hover: {
      y: -12,
      scale: 1.02,
      boxShadow: "0 32px 64px rgba(148, 163, 184, 0.2)",
      border: "1px solid #e2e8f0",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const gradientBarVariants: Variants = {
    initial: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <div className="relative bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_25%_25%,#f1f5f9_0%,transparent_50%),radial-gradient(circle_at_75%_75%,#f8fafc_0%,transparent_50%)] opacity-60 pointer-events-none" />

      <div className="relative z-10 3xl:max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12  md:w-[80%] md:mx-auto">
          <h2 className="  mb-4 ">
            <span className="text-3xl leading-tight lg:text-[72px] lg:leading-[79px] text-[#0f172a] font-extrabold ">
              Only{" "}
            </span>
            <span className="relative text-3xl leading-tight lg:text-[72px] lg:leading-[79px] bg-clip-text text-transparent  bg-gradient-to-r from-[#0f172a] via-[#3b82f6] to-[#8b5cf6]">
              Rexvet
              <span className=" absolute bottom-[-4px] md:bottom-[-6px] lg:bottom-[-8px] left-0 right-0 h-1 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4] rounded-sm opacity-30" />
            </span>{" "}
            <span className="text-3xl leading-tight lg:text-[72px] lg:leading-[79px]  lg:font-extrabold font-bold ml-1">
              connects you to Vet who care
            </span>
          </h2>
          <p className="text-base  lg:text-[21px] lg:leading-[33px]  my-14 text-[#64748b] font-normal max-w-xl mx-auto leading-relaxed ">
            Building a future where no pet goes without care
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4] rounded-sm mx-auto mt-4" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              className="w-full max-w-md  about-section-card"
            >
              {/* Card */}
              <div className="relative rounded-[32px] overflow-hidden bg-white border border-[#e2e8f0]">
                {/* Gradient Bar */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4] z-20"
                  variants={gradientBarVariants}
                  initial="initial"
                  animate="initial"
                />

                {/* Number Badge */}
                <div
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shadow-[0_8px_24px_rgba(0,0,0,0.25)] z-20"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                  }}
                >
                  {feature.number}
                </div>

                {/* Image Section */}
                <div className="relative h-80 m-6 rounded-3xl overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] flex items-center justify-center after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:to-[rgba(59,130,246,0.05)] after:rounded-3xl z-10">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={400}
                    height={320}
                    className="w-full h-full object-contain relative z-10"
                    priority={index < 3}
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 pt-3 z-10">
                  <div className="flex items-center mb-4">
                    {/* Icon */}
                    <div
                      className="w-18 h-18 rounded-full flex items-center justify-center text-3xl mr-auto"
                      style={{
                        background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}25)`,
                        border: `2px solid ${feature.color}20`,
                        boxShadow: `0 8px 32px ${feature.color}20`,
                      }}
                    >
                      {feature.icon}
                    </div>

                    {/* Chip */}
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full text-center"
                      style={{
                        backgroundColor: `${feature.color}10`,
                        color: feature.color,
                        border: `1px solid ${feature.color}20`,
                      }}
                    >
                      {feature.chip}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-base text-[#64748b] leading-relaxed text-justify">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 md:mt-12">
          <p className="text-base md:text-lg text-[#475569] font-medium mb-2 font-garet">
            {title}
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {tabs?.map((tag, index) => (
              <span
                key={index}
                className="border border-[#e2e8f0] text-[#64748b] hover:border-[#3b82f6] hover:text-[#3b82f6] px-2 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AboutUsSection);
