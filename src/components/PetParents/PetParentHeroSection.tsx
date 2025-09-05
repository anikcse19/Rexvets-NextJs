"use client";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
type Message = { isVet: boolean; message: string };
const PetParentHeroSection = () => {
  const chatMessages: Message[] = [
    { isVet: true, message: "Hi Alex, how is Bella doing today?" },
    {
      isVet: false,
      message: "She seems a bit lethargic and isn't eating much.",
    },
    { isVet: false, message: "Just some occasional coughing." },
    {
      isVet: true,
      message: "Let's do a virtual check-up to see how we can help.",
    },
  ];
  return (
    <section
      className="relative min-h-screen flex items-center bg-cover bg-center bg-fixed 
      before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(0,35,102,0.9)_0%,rgba(67,56,202,0.9)_50%,rgba(139,92,246,0.9)_100%)]"
      style={{
        backgroundImage: "url('/images/pet-parents/membershipsbg1.webp')",
      }}
    >
      <div className="container relative z-10 mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div className="text-white">
          <h1 className="md:text-[4rem] text-white lg:text-[4.5rem] text-[2.5rem]  font-black tracking-tight leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            Help Us Provide{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-semibold drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]">
              Affordable
            </span>{" "}
            Pet Telehealth
          </h1>
          <p className="mt-6  text-[1.1rem] md:text-[1.3rem] mb-6 text-white/90 leading-[1.6] drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)] max-w-[600px] ">
            At Rex Vet, we believe every pet deserves access to quality
            veterinary care, regardless of their owner's financial situation.
            Join our support community and help us continue providing essential
            care to pets everywhere.
          </p>
          <Link
            href="/donate-now"
            className="inline-flex items-center mt-8 px-6 py-3 rounded-full font-semibold 
              text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:scale-105 transition"
          >
            Donate Now <Heart className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
      <aside
        className={`hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 w-[350px] 
      rounded-3xl border border-white/20 bg-white/95 backdrop-blur-2xl px-6 py-7 shadow-2xl`}
      >
        <h3 className="mb-6 font-bold text-[#1e293b] text-xl">
          Live Consultation
        </h3>

        <div>
          {chatMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.15, duration: 0.35 }}
              className={`flex items-start gap-3 mb-4 ${
                msg.isVet ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {msg.isVet && (
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="/images/pet-parents/profileDoc.webp"
                    alt="Vet"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[70%] rounded-2xl leading-[1.4] text-[15px] pl-4 pr-12 py-2 shadow
              ${
                msg.isVet
                  ? "bg-slate-100 text-slate-800"
                  : "bg-blue-500  text-white"
              }`}
              >
                {msg.message}
              </div>

              {!msg.isVet && (
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
                text-white flex items-center justify-center text-sm font-semibold shrink-0"
                >
                  A
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default PetParentHeroSection;
