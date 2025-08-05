import { HTMLMotionProps, motion } from "framer-motion";
import React, { ReactNode } from "react";

interface AnimatedChipProps
  extends Omit<
    HTMLMotionProps<"div">,
    "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
  > {
  label?: string;
  icon?: ReactNode;
}

const AnimatedChip: React.FC<AnimatedChipProps> = ({
  label,
  icon,
  ...props
}) => {
  return (
    <div className="flex justify-center sm:justify-start">
      <motion.div
        className=" bg-[rgba(255,255,255,0.15)] backdrop-blur-[20px] rounded-full text-white font-semibold text-[14px] px-[16px] py-[4px] border border-[rgba(255,255,255,0.2)] inline-flex items-center mb-4"
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        {...props}
      >
        {icon && (
          <motion.span
            className="MuiChip-icon mr-2 text-[#60a5fa]"
            initial={{ y: 0 }}
            animate={{
              y: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {icon}
          </motion.span>
        )}
        {label}
      </motion.div>
    </div>
  );
};

export default AnimatedChip;
