"use client";
import { IBrand } from "@/lib";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import React from "react";

interface AwardsMarqueeProps {
  brands: IBrand[];
}

const AwardsMarquee: React.FC<AwardsMarqueeProps> = ({ brands }) => {
  // Framer Motion animation variants with explicit typing
  const marqueeVariants: Variants = {
    animate: {
      x: ["0%", "-50%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 15,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="w-full bg-[#001130] text-white py-3 px-2 ">
      <div className="flex flex-col lg:flex-row items-center">
        <h5 className="mb-3 md:mb-2 md:mr-4 font-bold text-center md:text-left text-[19px] md:text-[20px] md:leading-[29px]">
          Award winning & featured in...
        </h5>

        <div className="overflow-hidden flex-grow-1 relative min-h-[60px]">
          <motion.div
            className="flex items-center gap-10"
            variants={marqueeVariants}
            animate="animate"
            style={{ width: "max-content" }}
          >
            {brands.map((brand, index) => (
              <div key={index}>
                <Image
                  src={brand.imageUrl}
                  alt={brand.name}
                  width={220} // Adjust based on your needs
                  height={60} // Matches the original height
                  className="object-contain"
                  priority={false} // Set to true if images should load immediately
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AwardsMarquee;
