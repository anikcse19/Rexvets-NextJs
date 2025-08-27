"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

const TalkToVetButton = () => {
  const navigate = useRouter();

  return (
    <div className="flex justify-center mr-2.5">
      <motion.button
        onClick={() => navigate.push("/find-a-vet")}
        className="relative bg-[#113F67] text-white px-3 py-1 my-1 rounded-full font-semibold text-lg shadow-lg border-2 border-cyan-400/50 overflow-hidden cursor-pointer"
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 15px 35px rgba(34, 211, 238, 0.3)",
          borderColor: "rgba(34, 211, 238, 0.8)"
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {/* Animated overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full opacity-0 z-0"
          whileHover={{ opacity: 1 }}
          transition={{ 
            duration: 0.4,
            ease: "easeOut"
          }}
        />

        {/* Content container */}
        <div className="relative flex items-center gap-3 z-10">
          {/* Icon wrapper */}
          <motion.div
            className="w-10 h-10 flex items-center justify-center bg-cyan-400/20 rounded-full border border-cyan-400/50"
            whileHover={{ 
              boxShadow: "0 0 15px rgba(34, 211, 238, 0.6)",
              scale: 1.05,
              rotate: 5
            }}
            animate={{ 
              boxShadow: ["0 0 0px rgba(34, 211, 238, 0)", "0 0 8px rgba(34, 211, 238, 0.4)", "0 0 0px rgba(34, 211, 238, 0)"]
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            {/* Video Icon */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ 
                scale: 1.15,
                rotate: -5
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
              />
            </motion.svg>
          </motion.div>

          {/* Text */}
          <motion.span
            className="font-inter text-cyan-100 text-sm whitespace-nowrap font-medium"
            whileHover={{ 
              color: "#ffffff",
              x: 2
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            Talk to a Vet
          </motion.span>

          {/* Animated ping dot */}
          <motion.div
            className="w-2 h-2 bg-cyan-400 rounded-full"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.button>
    </div>
  );
};

export default TalkToVetButton;
