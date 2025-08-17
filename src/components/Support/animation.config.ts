import { MotionProps, Variants } from "framer-motion";

export const supportCardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export const supportHoverEffect: MotionProps["whileHover"] = {
  scale: 1.05,
  y: -5,
  transition: { type: "spring" as const, stiffness: 300, damping: 20 },
};
