"use client";
import { Variants } from "framer-motion";

export const rexHealthHubCardHover: Variants = {
  initial: { scale: 1, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" },
  hover: {
    scale: 1.05,
    y: -10,
    boxShadow: "0 40px 80px rgba(0, 0, 0, 0.25)",
    transition: { duration: 0.5 },
  },
};
export const rexHealthHubFadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};
