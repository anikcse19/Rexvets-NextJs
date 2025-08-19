"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { BookOpen, Brain } from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";

interface LeaderCardProps {
  name: string;
  title: string;
  description: string;
  image: string;
  icon: "School" | "Psychology";
  gradient: string;
  delay: number;
  gradients: {
    accent: string;
    secondary: string;
  };
}

const OurTeamLeaderCard: React.FC<LeaderCardProps> = ({
  name,
  title,
  description,
  image,
  icon,
  gradient,
  delay,
}) => {
  const zoomIn: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 1, ease: "easeOut", delay },
      },
    }),
    [delay]
  );

  return (
    <motion.div variants={zoomIn} initial="hidden" animate="visible">
      <Card
        className="
          h-full 
          rounded-2xl 
          overflow-hidden 
          bg-[rgba(255,255,255,0.05)] 
          backdrop-blur-xl 
          border 
          border-[rgba(255,255,255,0.1)] 
          shadow-[0_25px_80px_rgba(0,0,0,0.3)] 
          transition-all 
          duration-400 
          ease-in-out 
          hover:-translate-y-4 
          hover:scale-102 
          hover:shadow-[0_35px_100px_rgba(0,0,0,0.4)] 
          group"
      >
        <div className="relative overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={600}
            height={400}
            className="w-full h-[400px] object-contain transition-transform duration-600 ease-in-out group-hover:scale-110"
          />
          <div
            className="
              absolute 
              inset-0 
              bg-gradient-to-b 
              from-transparent 
              to-[rgba(0,0,0,0.3)]"
          ></div>
          <div
            className="
              absolute 
              top-4 
              right-4 
              bg-[rgba(255,255,255,0.2)] 
              rounded-full 
              p-1.5 
              backdrop-blur-xl 
              border 
              border-[rgba(255,255,255,0.3)]"
          >
            {icon === "School" ? (
              <BookOpen className="w-7 h-7 text-white" aria-hidden="true" />
            ) : (
              <Brain className="w-7 h-7 text-white" aria-hidden="true" />
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-2xl font-black text-white mb-1 font-inter">
            {name}
          </h3>
          <Badge
            className={`
              mb-3 
              px-2 
              text-sm 
              font-semibold 
              bg-gradient-to-r 
              ${gradient} 
              text-white`}
          >
            {title}
          </Badge>
          <p
            className="
              text-[rgba(255,255,255,0.85)] 
              leading-relaxed 
              text-base 
              font-inter 
              text-justify 
              md:text-left"
          >
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default React.memo(OurTeamLeaderCard);
