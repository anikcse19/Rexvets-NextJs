"use client";
import { useState, useEffect } from "react";
import { X, PawPrint, HeartPulse, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface TopToolbarPetParentProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TopToolbarPetParent({
  visible,
  setVisible,
}: TopToolbarPetParentProps) {
  useEffect(() => {
    const dismissedAt = localStorage.getItem("topToolbarDismissedAt");

    if (dismissedAt) {
      const now = Date.now();
      const diff = now - parseInt(dismissedAt, 10);

      // 1 hour = 3600000 ms
      if (diff < 3600000) {
        setVisible(false);
      } else {
        localStorage.removeItem("topToolbarDismissedAt");
        setVisible(true);
      }
    }
  }, [setVisible]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("topToolbarDismissedAt", Date.now().toString());
  };

  return (
    <AnimatePresence>
      {visible && (
        <div
          // initial={{ y: -80, opacity: 0 }}
          // animate={{ y: 0, opacity: 1 }}
          // exit={{ y: -80, opacity: 0 }}
          // transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full bg-gradient-to-r from-indigo-900 via-purple-800 to-emerald-700 
                     text-white px-6 py-3 pb-1 h-[60px] md:h-[50px] flex items-center justify-between 
                     shadow-lg shadow-black/30"
        >
          {/* Appointment Info Text */}
          <div className="flex-1 flex justify-center">
            <Link
              href="/find-a-vet"
              className="flex items-center gap-2 text-xs md:text-base font-bold tracking-wide drop-shadow-md"
            >
              <PawPrint className="w-5 h-5 text-yellow-400 animate-bounce" />
              <span>
                Book your{" "}
                <span className="text-yellow-300 font-extrabold">
                  Vet Appointment
                </span>{" "}
                today – starting just{" "}
                <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-md shadow-md inline-block mt-1 sm:mt-0">
                  $10/month
                </span>{" "}
                !
              </span>
              <Stethoscope className="w-5 h-5 text-green-400 animate-pulse" />
              <HeartPulse className="w-5 h-5 text-pink-400 animate-ping" />
            </Link>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="ml-4 rounded-full hover:bg-white/20 p-1 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </AnimatePresence>
  );
}
