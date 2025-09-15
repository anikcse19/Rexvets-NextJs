"use client";
import { useState, useEffect } from "react";
import {
  X,
  PawPrint,
  HeartPulse,
  Stethoscope,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface TopToolbarVetProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TopToolbarVet({
  visible,
  setVisible,
}: TopToolbarVetProps) {
  useEffect(() => {
    const dismissedAt = localStorage.getItem("topToolbarVetDismissedAt");

    if (dismissedAt) {
      const now = Date.now();
      const diff = now - parseInt(dismissedAt, 10);

      // 1 hour = 3600000 ms
      if (diff < 3600000) {
        setVisible(false);
      } else {
        localStorage.removeItem("topToolbarVetDismissedAt");
        setVisible(true);
      }
    }
  }, [setVisible]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("topToolbarVetDismissedAt", Date.now().toString());
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
              href="/dashboard/doctor/rates-and-availability"
              className="flex items-center gap-2 text-xs md:text-base font-semibold tracking-wide drop-shadow-md"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-300 animate-bounce" />
              <span>
                <span className="text-yellow-300 font-bold">
                  Action Needed:
                </span>{" "}
                Please set your{" "}
                <span className="underline text-yellow-200">
                  Schedule & Notice period
                </span>{" "}
                to start receiving appointments.
              </span>
              <Calendar className="w-5 h-5 text-white animate-pulse" />
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
