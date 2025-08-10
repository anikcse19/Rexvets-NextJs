/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "framer-motion";
import React from "react";
import { Card } from "../ui/card";

interface IProps {
  title: string;
  sub_title: string;
}

const FooterTrustBadgeCard: React.FC<IProps> = ({ title, sub_title }) => {
  return (
    <div className="mt-8 flex flex-wrap gap-5 ">
      <motion.a
        href="https://app.candid.org/profile/16018857/rex-Vet-inc-33-2469898"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{
          y: -4,
          scale: 1.02,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
        }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 min-w-[286px] h-[164px]"
        style={{
          transformOrigin: "center",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
        <Card className="h-full cursor-pointer rounded-xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-md transition-all hover:border-amber-400/50 hover:bg-white/15 flex flex-col items-center justify-center overflow-hidden">
          <img
            src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/16018857/svg"
            alt="Candid Transparency Seal"
            className="mb-0 h-[90px] w-[90px]"
          />
          <p className="text-xs -mt-3 font-semibold text-white/90 md:text-sm">
            {title}
          </p>
        </Card>
      </motion.a>

      <motion.a
        href="https://greatnonprofits.org/org/rex-Vet-inc"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{
          y: -4,
          scale: 1.02,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
        }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 min-w-[280px] h-[164px]"
        style={{
          transformOrigin: "center",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
        <Card className="h-full cursor-pointer rounded-xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-md transition-all hover:border-amber-400/50 hover:bg-white/15 flex flex-col items-center justify-center overflow-hidden">
          <img
            src="//cdn.greatnonprofits.org//img/2025-top-rated-awards-badge-embed.png?id=997664264"
            alt="Rex Vet Inc. Nonprofit Overview and Reviews on GreatNonprofits"
            className="mb-0 h-[90px] w-[90px] object-contain"
          />
          <p className="text-xs font-semibold text-white/90 md:text-sm">
            {sub_title}
          </p>
        </Card>
      </motion.a>
    </div>
  );
};

export default React.memo(FooterTrustBadgeCard);
