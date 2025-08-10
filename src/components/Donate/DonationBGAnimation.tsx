"use client";
import { Variants, motion } from "framer-motion";
import React from "react";

const DonationBGAnimation = () => {
  const floatVariant: Variants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 2, 0],
      transition: {
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  const pulseVariant: Variants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 0.4, 0.7],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };
  return (
    <>
      <motion.div
        className="absolute inset-0"
        variants={floatVariant}
        animate="animate"
      />

      {/* Geometric shapes with pulse and float animations */}

      <motion.div
        className="absolute top-[10%] left-[10%] w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[rgba(255,107,107,0.2)] to-[rgba(255,107,107,0.05)]"
        variants={pulseVariant}
        animate="animate"
      />
      <motion.div
        className="absolute top-[70%] right-[15%] w-[80px] h-[80px] rounded-[20%] bg-gradient-to-br from-[rgba(78,205,196,0.15)] to-[rgba(78,205,196,0.05)]"
        variants={floatVariant}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 2, 0],
          transition: {
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
      />
      <motion.div
        className="absolute top-[30%] right-[5%] w-[60px] h-[60px]"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        variants={{
          animate: {
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.4, 0.7],
            transition: { duration: 6, ease: "easeInOut", repeat: Infinity },
          },
        }}
        animate="animate"
      />

      <motion.div
        className="absolute top-[15%] right-[25%] w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[rgba(150,206,180,0.18)] to-[rgba(150,206,180,0.06)]"
        variants={floatVariant}
        animate="animate"
      />

      <motion.div
        className="absolute top-[60%] left-[5%] w-[70px] h-[70px]"
        style={{
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
        variants={{
          animate: {
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.4, 0.7],
            transition: { duration: 7, ease: "easeInOut", repeat: Infinity },
          },
        }}
        animate="animate"
      />

      <motion.div
        className="absolute top-[45%] left-[20%] w-[35px] h-[35px] rounded-[30%] bg-gradient-to-br from-[rgba(255,107,107,0.15)] to-[rgba(255,107,107,0.05)]"
        variants={floatVariant}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 2, 0],
          transition: {
            duration: 9,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
      />

      <motion.div
        className="absolute top-[25%] left-[70%] w-[50px] h-[50px]"
        style={{
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        }}
        variants={{
          animate: {
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.4, 0.7],
            transition: { duration: 5.5, ease: "easeInOut", repeat: Infinity },
          },
        }}
        animate="animate"
      />

      <motion.div
        className="absolute top-[80%] left-[60%] w-[45px] h-[45px] rounded-full bg-gradient-to-br from-[rgba(150,206,180,0.14)] to-[rgba(150,206,180,0.04)]"
        variants={floatVariant}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 2, 0],
          transition: { duration: 6.5, ease: "easeInOut", repeat: Infinity },
        }}
      />

      <motion.div
        className="absolute top-[5%] left-[45%] w-[25px] h-[25px]"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        variants={{
          animate: {
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.4, 0.7],
            transition: { duration: 4.5, ease: "easeInOut", repeat: Infinity },
          },
        }}
        animate="animate"
      />

      <motion.div
        className="absolute top-[85%] right-[40%] w-[55px] h-[55px]"
        style={{
          clipPath:
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        }}
        variants={floatVariant}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 2, 0],
          transition: {
            duration: 7.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
      />

      <motion.div
        className="absolute top-[40%] right-[45%] w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[rgba(255,107,107,0.12)] to-[rgba(255,107,107,0.04)]"
        variants={{
          animate: {
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.4, 0.7],
            transition: { duration: 8.5, ease: "easeInOut", repeat: Infinity },
          },
        }}
        animate="animate"
      />
    </>
  );
};

export default React.memo(DonationBGAnimation);
