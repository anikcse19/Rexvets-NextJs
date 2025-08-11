"use client";
import { Button } from "@/components/ui/button";
import { checkWindow } from "@/services/googleService";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { FC, useEffect, useState } from "react";

const ScrollToTop: FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!checkWindow()) {
      return;
    }
    const toggleVisibility = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {visible && (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-primary-main to-primary-light shadow-lg hover:scale-110 hover:shadow-xl transition-all"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </motion.div>
  );
};

export default ScrollToTop;
