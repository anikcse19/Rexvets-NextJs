"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  note?: string;
}

const processSteps: ProcessStep[] = [
  {
    number: "1",
    title: "Schedule an Affordable Consultation",
    description:
      "Find top-rated vets near you and pick the best one for your needs.",
  },
  {
    number: "2",
    title: "Connect Online",
    description:
      "Choose a time that works for you and your pet for a consultation.",
  },
  {
    number: "3",
    title: "Order Medications Online",
    description:
      "Get specific guidance for your pet's health, including advice, triage, and second opinions.",
    note: "Note: Medications must be purchased separately.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
};

const HowItWorksProcess = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              variants={textVariants}
              className="text-3xl md:text-5xl font-extrabold mb-6"
            >
              Connecting with a Rex Vets veterinarian is{" "}
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-md">
                easy and stress-free
              </span>
            </motion.h2>
            <motion.p
              variants={textVariants}
              className="text-lg md:text-xl text-white/80 mb-8"
            >
              Here&apos;s how it works:
            </motion.p>
            <div className="space-y-6 mb-8">
              {processSteps.map((step, index) => (
                <motion.div key={index} variants={cardVariants}>
                  <Card className="p-8 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 hover:-translate-y-1 hover:shadow-xl transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {step.title}
                        </h3>
                        <p className="text-white/80 text-justify md:text-left">
                          {step.description}
                        </p>
                        {step.note && (
                          <p className="text-amber-400 font-semibold italic mt-2">
                            {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <motion.div variants={cardVariants}>
              <Button
                asChild
                variant="default"
                size="lg"
                className="group bg-gradient-to-r from-white to-gray-100 text-gray-900 font-bold rounded-full px-11 py-7 shadow-lg hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:-translate-y-0.5 transition-all"
              >
                <Link href="/find-a-vet">
                  Get Started Today
                  <Star className="ml-2 h-5 w-5 group-hover:text-yellow-500" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <Image
              src="/images/how-it-works/mblIm.webp"
              alt="Vet consultation"
              width={600}
              height={800}
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default React.memo(HowItWorksProcess);
