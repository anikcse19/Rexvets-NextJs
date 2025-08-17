"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

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

type StatsCTASectionProps = {
  isVisible: boolean;
  stats: {
    title: string;
    value: string;
    description: string;
    icon: JSX.Element;
    color: string;
  }[];
};

const BecomeRexVetStatsCTASection: React.FC<StatsCTASectionProps> = ({
  isVisible,
  stats,
}) => {
  return (
    <section className="py-12 md:py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              You're Needed Now More Than Ever
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Veterinarians on Rex Vets are helping fill critical care gaps for
              pets across the country.
            </p>
            <Button
              asChild
              variant="default"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl"
            >
              <Link href="/register">
                Join the Movement <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={zoomIn}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                  <CardContent className="p-4">
                    <Avatar
                      className={`w-12 h-12 mx-auto mb-4 bg-white ${stat.color}`}
                    >
                      {stat.icon}
                    </Avatar>
                    <h3 className="text-2xl font-bold text-white">
                      {stat.value}
                    </h3>
                    <h4 className="text-base font-semibold text-white">
                      {stat.title}
                    </h4>
                    <p className="text-sm opacity-80 text-white hidden md:block">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeRexVetStatsCTASection;
