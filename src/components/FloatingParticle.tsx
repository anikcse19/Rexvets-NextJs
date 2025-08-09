"use client";

import { motion } from "framer-motion";
import { Dog, HeartPulse, Hospital } from "lucide-react"; // Use Dog instead of Pets
import React from "react";

// const MorphingShape = ({ style }: { style?: React.CSSProperties }) => (
//   <div
//     style={{
//       width: 100,
//       height: 100,
//       borderRadius: "50%",
//       background: "radial-gradient(circle, rgba(96,165,250,0.4), transparent)",
//       position: "absolute",
//       ...style,
//       animation: "morph 6s ease-in-out infinite",
//     }}
//   />
// );

const FloatingParticle = ({
  style,
  delay,
  duration,
  size,
}: {
  style?: React.CSSProperties;
  delay: number;
  duration: number;
  size: number;
}) => (
  <motion.div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "rgba(96,165,250,0.2)",
      position: "absolute",
      ...style,
    }}
    animate={{
      y: [0, -20, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none  top-20">
      {/* Morphing Shapes */}

      {/* Floating Particles */}
      <FloatingParticle
        style={{ top: "13%", left: "6%" }}
        delay={1}
        duration={6}
        size={70}
      />

      <FloatingParticle
        style={{ bottom: "30%", left: "15%" }}
        delay={1}
        duration={7}
        size={100}
      />
      <FloatingParticle
        style={{ top: "50%", left: "90%" }}
        delay={1}
        duration={9}
        size={70}
      />
      <FloatingParticle
        style={{ bottom: "60%", right: "25%" }}
        delay={3}
        duration={5}
        size={50}
      />

      {/* Animated Icons with Lucide React */}
      <motion.div
        className="absolute"
        style={{ top: "14%", right: "20%" }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      >
        <Dog size={40} color="rgba(96, 165, 250, 0.6)" />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ bottom: "50%", left: "10%" }}
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      >
        <Hospital size={35} color="rgba(167, 139, 250, 0.6)" />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ top: "70%", right: "8%" }}
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 4,
        }}
      >
        <HeartPulse size={30} color="rgba(244, 114, 182, 0.6)" />
      </motion.div>
    </div>
  );
};

export default FloatingElements;
