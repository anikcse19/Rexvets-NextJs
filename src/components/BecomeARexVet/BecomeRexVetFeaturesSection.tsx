"use client";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { JSX } from "react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

type FeaturesSectionProps = {
  isVisible: boolean;
  features: {
    icon: JSX.Element;
    title: string;
    description: string;
    gradient: string;
  }[];
};

const BecomeRexVetFeaturesSection: React.FC<FeaturesSectionProps> = ({
  isVisible,
  features,
}) => {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1976d208, #9c27b005)",
      }}
      className="py-12 md:py-20 "
    >
      <div className="max-w-[1200px] mx-auto px-4 text-center">
        <div className="mb-4 flex items-center py-1 px-4 justify-center w-fit mx-auto bg-transparent rounded-full border border-blue-200">
          <p> What Makes Us Different</p>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-4">
          More Than Just Telehealth
        </h2>
        <p className="text-[24px] text-gray-600 max-w-2xl mx-auto">
          We&apos;re building a movement to transform veterinary care and support
          both vets and pet owners.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              transition={{ delay: index * 0.3 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100/20 rounded-2xl h-full text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-6">
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, 1, 0, -1, 0],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600 mt-2">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BecomeRexVetFeaturesSection;
