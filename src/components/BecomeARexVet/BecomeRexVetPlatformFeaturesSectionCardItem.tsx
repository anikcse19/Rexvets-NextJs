"use client";
import { Avatar } from "@radix-ui/react-avatar";
import { motion, Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import React from "react";

interface IProps {
  title: string;
  description: string;
  isVisible: boolean;
  index: number;
  iconBgClass?: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const BecomeRexVetPlatformFeaturesSectionCardItem: React.FC<IProps> = ({
  title,
  description,
  isVisible,
  index,
  iconBgClass = "bg-[#44A148]",
}) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ delay: index * 0.2 }}
      className="flex gap-3 items-start"
    >
      <Avatar
        className={`w-8 h-8 min-w-8 min-h-8 flex items-center justify-center rounded-full flex-shrink-0 ${iconBgClass}`}
        style={{ width: "2rem", height: "2rem" }} // Explicitly set width and height
      >
        <CheckCircle2 className="w-4 h-4 text-white" />
      </Avatar>
      <div className="flex flex-col gap-y-2">
        {title && (
          <h4 className="text-[20px] text-start leading-[28px] font-semibold">
            {title}
          </h4>
        )}
        <p className="text-base font-normal text-start text-gray-600">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default React.memo(BecomeRexVetPlatformFeaturesSectionCardItem);
