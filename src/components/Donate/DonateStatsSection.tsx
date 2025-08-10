"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import React, { FC } from "react";
import { FaHome } from "react-icons/fa";
import { MdGroup, MdLocalHospital, MdPets } from "react-icons/md";
import { AnimatedSection } from "../shared";

// const stats = [
//   {
//     icon: <PawPrint size={32} />,
//     number: "10K+",
//     label: "Pets Helped",
//     delay: 0,
//   },
//   {
//     icon: <Hospital size={32} />,
//     number: "500+",
//     label: "Treatments",
//     delay: 0.2,
//   },
//   {
//     icon: <Home size={32} />,
//     number: "50+",
//     label: "Shelters Supported",
//     delay: 0.4,
//   },
//   {
//     icon: <Users size={32} />,
//     number: "1000+",
//     label: "Families Helped",
//     delay: 0.6,
//   },
// ];

const DonateStatsSection: FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<MdPets className="h-8 w-8" />}
            number="10K+"
            label="Pets Helped"
            delay={0}
          />
          <StatCard
            icon={<MdLocalHospital className="h-8 w-8" />}
            number="500+"
            label="Treatments"
            delay={200}
          />
          <StatCard
            icon={<FaHome className="h-8 w-8" />}
            number="50+"
            label="Shelters Supported"
            delay={400}
          />
          <StatCard
            icon={<MdGroup className="h-8 w-8" />}
            number="1000+"
            label="Families Helped"
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};
interface StatCardProps {
  icon: React.ReactNode;
  number: string;
  label: string;
  delay?: number;
}

export default React.memo(DonateStatsSection);
const StatCard: React.FC<StatCardProps> = ({
  icon,
  number,
  label,
  delay = 0,
}) => {
  return (
    <AnimatedSection delay={delay}>
      <Card className="p-6 text-center h-full bg-white/90 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02]">
        <CardContent className="flex flex-col items-center p-0">
          <Avatar className="w-20 h-20 mb-4 shadow-lg">
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl flex items-center justify-center">
              {icon}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
            {number}
          </h3>
          <p className="text-lg font-semibold text-gray-600">{label}</p>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
};
