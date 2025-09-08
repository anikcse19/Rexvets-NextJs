"use client";
import { useState, useEffect } from "react";
import { X, PawPrint, HeartPulse, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function TopToolbar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("topToolbarDismissed");
    if (dismissed) setVisible(false);
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("topToolbarDismissed", "true");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full bg-gradient-to-r from-indigo-900 via-purple-800 to-emerald-700 
                     text-white px-6 py-3 flex items-center justify-between 
                     shadow-lg shadow-black/30"
        >
          {/* Appointment Info Text */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 text-sm md:text-base font-bold tracking-wide drop-shadow-md">
              <PawPrint className="w-5 h-5 text-yellow-400 animate-bounce" />
              <span>
                Book your{" "}
                <Link
                  href="/find-a-vet"
                  className="text-yellow-300 font-extrabold"
                >
                  Vet Appointment
                </Link>{" "}
                today – starting from just{" "}
                <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-md shadow-md">
                  $35
                </span>
                !
              </span>
              <Stethoscope className="w-5 h-5 text-green-400 animate-pulse" />
              <HeartPulse className="w-5 h-5 text-pink-400 animate-ping" />
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="ml-4 rounded-full hover:bg-white/20 p-1 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
