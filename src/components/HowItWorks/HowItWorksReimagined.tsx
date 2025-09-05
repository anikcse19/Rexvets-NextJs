import { Badge } from "@/components/ui/badge";
import { motion, Variants } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

const textVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: "easeOut" } },
};

const HowItWorksReimagined = () => {
  const features = ["Comfort", "Convenience", "Compassion", "Quality Care"];

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="  text-gray-900 mb-6">
              <span className="text-3xl md:text-5xl font-extrabold">
                Veterinary care{" "}
              </span>
              <span className=" text-base md:text-3xl  bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                reimagined
              </span>
            </h2>
            <p className="text-gray-600 mb-6 text-base md:text-lg mt-5">
              Rex Vet brings veterinary care to your home—no more stressful car
              rides or clinic waiting rooms. We prioritize comfort, convenience,
              and compassion so your pet feels safe and supported every step of
              the way.
            </p>
            <div className="flex gap-2 flex-wrap">
              {features.map((feature, index) => (
                <Badge
                  key={index}
                  className="bg-sky-100 text-sky-700 border rounded-full  border-sky-500 font-semibold px-5 py-2"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {feature}
                </Badge>
              ))}
            </div>
          </motion.div>
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <Image
              src="/images/how-it-works/SecondImg.webp"
              alt="Veterinary care reimagined"
              width={600}
              height={400}
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default React.memo(HowItWorksReimagined);
