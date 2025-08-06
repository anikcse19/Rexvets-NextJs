"use client";
import { motion, Variants } from "framer-motion";
import React from "react";
import { IoCheckmarkCircle, IoFlashOutline } from "react-icons/io5";
import { Button } from "../../ui/button";

interface IProps {
  perAppointmentFeatures: string[];
  onClick?: () => void;
  isSmallDevice?: boolean;
  hoveredCard: "per" | "family" | null;
  setHoveredCard: React.Dispatch<React.SetStateAction<"per" | "family" | null>>;
}

const RexVetAPointmentFeeInfo: React.FC<IProps> = ({
  perAppointmentFeatures,
  onClick,
  isSmallDevice,
  hoveredCard,
  setHoveredCard,
}) => {
  // const [hoveredCard, setHoveredCard] = useState<"per" | null>(null);
  // const [isSmallDevice, setIsSmallDevice] = useState(false);

  // Detect small devices (below lg breakpoint, 1024px)
  // useEffect(() => {
  //   const mediaQuery = window.matchMedia("(max-width: 1023px)");
  //   setIsSmallDevice(mediaQuery.matches);

  //   const handleResize = (e: MediaQueryListEvent) => {
  //     setIsSmallDevice(e.matches);
  //   };
  //   mediaQuery.addEventListener("change", handleResize);
  //   return () => mediaQuery.removeEventListener("change", handleResize);
  // }, []);

  const cardVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      rotate: 0,
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
    hover: {
      y: -8,
      scale: 1.05,
      rotate: -1,
      boxShadow: "0 25px 50px rgba(255,193,7,0.25)",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    tilt: {
      rotate: [-2, -1, -2],
      y: [0, -5, 0],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const buttonVariants: Variants = {
    initial: { y: 0 },
    hover: {
      y: -2,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      onMouseEnter={() => setHoveredCard("per")}
      onMouseLeave={() => setHoveredCard(null)}
      variants={cardVariants}
      initial="initial"
      animate={
        hoveredCard === "per" ? "hover" : isSmallDevice ? "initial" : "tilt"
      }
      className={`relative w-full lg:w-[75%] rounded-3xl mb-4 lg:mb-0 ${
        hoveredCard === "per" ? "z-[100]" : "z-[2]"
      } lg:absolute lg:top-0 lg:left-0`}
    >
      <div className="relative p-6 bg-gradient-to-br from-white/95 to-yellow-50/95 backdrop-blur-xl rounded-3xl border-2 border-amber-300/30 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-700" />
        <div className="absolute -top-2.5 -right-2.5 w-16 h-16 bg-gradient-to-br from-amber-200/40 to-amber-400/40 rounded-full blur-md" />

        <div className="flex items-start space-x-2 mb-2">
          <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shadow-[0_8px_16px_rgba(255,193,7,0.25)]">
            <IoFlashOutline className="text-white text-base" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">Per Appointment</h3>
            <p className="text-sm text-gray-600">
              Perfect for occasional visits
            </p>
          </div>
          <div className="text-right">
            <h4 className="text-2xl font-bold text-amber-600">$35</h4>
            <p className="text-xs text-gray-600">per visit</p>
          </div>
        </div>

        <div className="space-y-1 mb-3">
          {perAppointmentFeatures.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div className="w-3.5 h-3.5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                <IoCheckmarkCircle className="text-white text-[8px]" />
              </div>
              <p className="text-sm text-gray-600 leading-5">{feature}</p>
            </div>
          ))}
        </div>

        <motion.div variants={buttonVariants} whileHover="hover">
          <Button
            className="w-full py-7 bg-gradient-to-br from-amber-500 to-amber-700 font-bold text-white rounded-lg shadow-[0_4px_12px_rgba(255,193,7,0.25)] hover:shadow-[0_8px_20px_rgba(255,193,7,0.3)]"
            onClick={onClick}
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(RexVetAPointmentFeeInfo);
