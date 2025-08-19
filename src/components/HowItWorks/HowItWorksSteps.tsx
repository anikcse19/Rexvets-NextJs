"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar, Pill, Truck, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Step {
  image: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const steps: Step[] = [
  {
    image: "/images/how-it-works/HowitsWork2.svg",
    title: "Book a Low-Cost Vet Consultation",
    description:
      "Schedule an affordable consultation with our licensed veterinarians at your convenience.",
    icon: Calendar,
    color: "#3b82f6",
  },
  {
    image: "/images/how-it-works/HowitsWork3.webp",
    title: "Connect with a Licensed Veterinarian",
    description:
      "Meet with experienced vets through secure video calls from the comfort of your home.",
    icon: Video,
    color: "#8b5cf6",
  },
  {
    image: "/images/how-it-works/HowitsWork1.svg",
    title: "Get Prescriptions Sent Online",
    description:
      "Receive digital prescriptions and treatment plans tailored to your pet's needs.",
    icon: Pill,
    color: "#10b981",
  },
  {
    image: "/images/how-it-works/HowitsWork4.webp",
    title: "Receive Medications at Your Doorstep",
    description:
      "Get medications delivered directly to your home with fast, reliable shipping.",
    icon: Truck,
    color: "#f59e0b",
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

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardVariants: Variants = {
  hidden: (index: number) => ({
    opacity: 0,
    x: index % 2 === 0 ? -100 : 100, // Slide from left for even, right for odd
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

interface IProps {}
const HowItWorksSteps: React.FC<IProps> = () => {
  return (
    <section
      className="py-12 md:py-20 bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%), url('/images/paw-texture.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            How it Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
            Caring for Your Pet in 4 Simple Steps
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded mx-auto mt-6" />
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="h-[530px] rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-200/50 hover:-translate-y-4 hover:scale-102 hover:shadow-2xl transition-all duration-400">
                <div className="relative overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={300}
                    height={320}
                    className="w-full h-[321px] object-cover transition-transform duration-600 hover:scale-110"
                  />
                  <div
                    className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: step.color }}
                  >
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          //   variants={buttonVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <Button
            asChild
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full px-11 py-7 shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Link href="/find-a-vet">
              Book a Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
export default React.memo(HowItWorksSteps);
