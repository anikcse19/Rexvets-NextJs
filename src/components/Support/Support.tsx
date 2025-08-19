"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import React from "react";
import { FaClock, FaHospital } from "react-icons/fa";
import { stayConnectedData, supportOptions } from "./support.data";
const loader = () => <p>Loading...</p>;
const SupportStayConnected = dynamic(() => import("./SupportStayConnected"), {
  loading: loader,
  ssr: false,
});
const SupportOptions = dynamic(() => import("./SupportOptions"), {
  loading: loader,
  ssr: false,
});

const Support: React.FC = () => {
  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-fixed relative overflow-hidden py-14"
        style={{
          backgroundImage: `linear-gradient(rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)), url(/images/support/support.webp)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)
            `,
          }}
        />
        <div className=" max-w-[1200px] mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <FaHospital className="text-white text-5xl mr-2" />
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                Help & Support
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Looking to connect with a veterinary professional?{" "}
              <a
                href="https://www.rexvets.com/FindAVet"
                className="text-white font-semibold underline hover:text-gray-200"
              >
                Book an appointment
              </a>{" "}
              for medical consultations.
            </p>
            <div className="flex items-center justify-center mt-4">
              <FaClock className="text-white mr-2" />
              <p className="text-white font-medium">Support Hours:</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="bg-white/25 backdrop-blur-md text-white font-semibold px-3 py-1 rounded-full border border-white/40 shadow-sm">
                Mon-Sun: 7AM - 11PM EST
              </span>
            </div>
          </motion.div>

          <SupportOptions options={supportOptions} />

          <SupportStayConnected
            title="Stay Connected"
            description="Follow us on social media for updates, tips, and community support"
            links={stayConnectedData}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(Support);
