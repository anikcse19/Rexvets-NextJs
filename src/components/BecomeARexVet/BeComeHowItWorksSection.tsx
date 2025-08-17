"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar, HelpingHand, TrendingUp } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";
import { IBecomePlatformOverview } from "./become.type";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

type HowItWorksSectionProps = {
  isVisible: boolean;
  platformFeatures: {
    icon: JSX.Element;
    title: string;
    description: string;
  }[];
  platformFeaturesOverview: IBecomePlatformOverview[]; // Add this line to define the platformFeatures prop as an array of IBecomePlatformOverview objectsorms
};

const BeComeHowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  isVisible,
  platformFeatures = [],
  platformFeaturesOverview = [],
}) => {
  return (
    <section
      id="how-it-works"
      className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="space-y-6"
          >
            <div className="inline-flex items-center justify-center h-8 px-4 mb-6 text-[0.8125rem] font-['Roboto','Helvetica','Arial','sans-serif'] text-blue-600 rounded-2xl border border-blue-200 bg-blue-50 whitespace-nowrap">
              <TrendingUp className="w-4 h-4 mr-2 text-gray-700" />
              Grow Your Impact
            </div>

            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-400 bg-clip-text text-transparent">
              Grow your reach.
              <br />
              We handle the rest.
            </h2>
            <p className="text-[24px] text-gray-600">
              Rex Vet connects you with pet parents, without the admin work.
            </p>
            {platformFeaturesOverview?.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100/20 rounded-2xl hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar
                      className={`w-10 h-10 flex items-center justify-center ${item.color}`}
                    >
                      {item.icon}
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <Button
              asChild
              variant="default"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl"
            >
              <Link
                href="/register"
                className="bg-gradient-to-br from-[#1976d2] to-[#9c27b0] py-7 px-24 rounded-md inline-flex items-center justify-center text-white text-xl font-semibold transform transition-all duration-300 ease-in-out hover:-translate-y-1"
              >
                Join the Movement
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            variants={zoomIn}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <div className="rounded-[32px] backdrop-blur-[20px] border border-[#1976d220] bg-gradient-to-br from-[#1976d208] to-[#9c27b005] p-7">
              <h3 className="text-2xl font-semibold text-center my-7">
                Platform Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {platformFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 text-center bg-white rounded-2xl border border-blue-100/20 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <Avatar className="w-10 h-10 items-center justify-center rounded-full mx-auto mb-3 bg-blue-100 text-blue-600">
                      {feature.icon}
                    </Avatar>
                    <h4 className="text-lg mb-2 font-semibold">
                      {feature.title}
                    </h4>
                    <p className="text-sm font-normal text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BeComeHowItWorksSection;
