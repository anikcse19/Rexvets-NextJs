import { motion, Variants } from "framer-motion";
import React from "react";
import {
  IoHeartOutline,
  IoMedkitOutline,
  IoShieldOutline,
} from "react-icons/io5";

const RexVetPlanAnimatedBackground = () => {
  // Framer Motion variants for pulse effect
  const pulseVariants: Variants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };
  const floatVariants: Variants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  };
  const floatDelayedVariants: Variants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      },
    },
  };
  const floatDelayed2Variants: Variants = {
    animate: {
      y: [0, -25, 0],
      transition: {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 4,
      },
    },
  };

  return (
    <>
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-300/25 to-purple-300/25 rounded-full blur-3xl"
        variants={pulseVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/2 -right-32 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-red-300/20 rounded-full blur-2xl"
        variants={pulseVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-200/20 to-cyan-200/20 rounded-full blur-3xl"
        variants={pulseVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      {/* Floating Icons */}
      <motion.div
        className="absolute top-20 left-20"
        variants={floatVariants}
        animate="animate"
      >
        <IoHeartOutline className="text-red-300 text-2xl opacity-40" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-32"
        variants={floatDelayedVariants}
        animate="animate"
      >
        <IoMedkitOutline className="text-indigo-300 text-3xl opacity-40" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-1/3"
        variants={floatDelayed2Variants}
        animate="animate"
      >
        <IoShieldOutline className="text-green-300 text-xl opacity-40" />
      </motion.div>
    </>
  );
};

export default React.memo(RexVetPlanAnimatedBackground);
