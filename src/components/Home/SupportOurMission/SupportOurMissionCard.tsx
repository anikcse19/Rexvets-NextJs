"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface DonationTier {
  id: string;
  title: string;
  description: string;
  image: StaticImageData;
  amounts: number[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

interface DonationCardProps {
  tier: DonationTier;
}

const SupportOurMissionCard: React.FC<DonationCardProps> = ({ tier }) => {
  const navigate = useRouter();

  // Framer Motion variants for card animations
  const cardVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    },
    hover: {
      y: -4,
      scale: 1.02,
      boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    popularHover: {
      y: -12,
      scale: 1.02,
      boxShadow: "0 16px 48px rgba(33,150,243,0.2)",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  };

  // Framer Motion variants for button hover
  const buttonVariants: Variants = {
    initial: { y: 0 },
    hover: {
      y: -2,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  // Framer Motion variants for badge
  const badgeVariants: Variants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover={tier.popular ? "popularHover" : "hover"}
      className={`relative h-full flex flex-col rounded-xl ${
        tier.popular
          ? "bg-[#002366] text-white border-2 border-[#002366] lg:-translate-y-4"
          : "bg-white border border-gray-200"
      } shadow-lg ${
        tier.popular
          ? "shadow-[0_12px_40px_rgba(33,150,243,0.15)]"
          : "shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
      } hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] ${
        tier.popular && "hover:shadow-[0_16px_48px_rgba(33,150,243,0.2)]"
      }`}
    >
      {tier.popular && (
        <motion.div
          variants={badgeVariants}
          initial="initial"
          whileHover="hover"
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
        >
          <Badge className="bg-white text-[#0E2148] border-2 border-[#002366] font-semibold text-sm px-3 shadow-lg rounded-full">
            Most Popular
          </Badge>
        </motion.div>
      )}

      <div
        className={`flex-1 flex flex-col p-6 ${
          tier.popular ? "pt-10" : "pt-6"
        } text-center`}
      >
        {/* Avatar and Icon */}
        <div className="relative flex justify-center mb-6">
          <Image
            src={tier.image}
            alt={tier.title}
            height={100}
            width={100}
            priority
            className="w-[100px] h-[100px] rounded-full border-4 border-white object-cover"
          />
          <div
            className="absolute bottom-[-8px] right-[calc(50%-58px)] w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: tier.color,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {tier.icon}
          </div>
        </div>

        {/* Title and Description */}
        <h3
          className={`text-xl md:text-2xl font-semibold ${
            tier.popular ? "text-white" : "text-[#0E2148]"
          } mb-4`}
        >
          {tier.title}
        </h3>
        <p
          className={`text-base ${
            tier.popular ? "text-gray-200" : "text-gray-600"
          } leading-relaxed flex-1 mb-6`}
        >
          {tier.description}
        </p>

        {/* Amount Buttons */}
        <div className="mb-6">
          <p
            className={`text-base ${
              tier.popular ? "text-gray-100" : "text-gray-700"
            } font-medium mb-4`}
          >
            Choose an amount:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {tier.amounts.map((amount) => (
              <motion.div
                key={amount}
                variants={buttonVariants}
                whileHover="hover"
              >
                <Button
                  variant="outline"
                  className={`rounded-full px-6 py-2 border ${
                    tier.popular
                      ? "border-white text-white"
                      : "border-[#0E2148] text-[#0E2148]"
                  } ${
                    tier.popular ? "bg-[#002366]/20" : "bg-transparent"
                  } font-medium text-xs min-w-[70px]`}
                  onClick={() => {
                    navigate.push(
                      `/donate-page2?amount=${amount}&badge=${tier.title}`
                    );
                  }}
                >
                  {amount === 0 ? "Custom" : `$${amount}`}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Donate Button */}
        <motion.div variants={buttonVariants} whileHover="hover">
          <Button
            className={`w-full z-50 cursor-pointer py-7 px-8 rounded-full ${
              tier.popular
                ? "bg-white text-[#002366]"
                : "bg-[#0E2148] text-white"
            } font-semibold text-base ${
              tier.popular ? "hover:bg-white hover:text-[#002366]" : ""
            } shadow-[0_6px_20px_${tier.color}40] ${
              !tier.popular && `hover:shadow-[0_8px_25px_${tier.color}60]`
            }`}
            onClick={() => navigate.push("/donation")}
          >
            💙 Donate Now
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(SupportOurMissionCard);
