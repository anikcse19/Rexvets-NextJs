"use client";
import React from "react";

import { IoHeart, IoStar, IoTrophy } from "react-icons/io5";
import champion from "../../../../public/images/Homepage/championBadge3.webp";
import friendRex from "../../../../public/images/Homepage/friendBadge3.webp";
import pectaseHero from "../../../../public/images/Homepage/heroBadge4.webp";
import SupportOurMissionCard from "./SupportOurMissionCard";
import SupportOurMissionHeader from "./SupportOurMissionHeader";

const mockImages = {
  friendRex,
  champion,
  pectaseHero,
};

const donationTiers = [
  {
    id: "friend-of-rex",
    title: "Friend of Rex Vet",
    description:
      "Provide affordable telehealth consultations to pets in need with a monthly contribution.",
    image: mockImages.friendRex,
    amounts: [20, 25, 50],
    icon: <IoHeart className="text-white text-lg" />,
    color: "#0E2148",
  },
  {
    id: "community-champion",
    title: "Community Champion",
    description:
      "Support critical care for pets in underserved communities, ensuring access to necessary help.",
    image: mockImages.champion,
    amounts: [100, 250, 500],
    popular: true,
    icon: <IoStar className="text-white text-lg" />,
    color: "#0E2148",
  },
  {
    id: "pet-care-hero",
    title: "Pet Care Hero",
    description:
      "Support comprehensive care services and help expand our reach to more pets in need.",
    image: mockImages.pectaseHero,
    amounts: [1000, 1500, 0],
    icon: <IoTrophy className="text-white text-lg" />,
    color: "#0E2148",
  },
];

const DonationSection: React.FC = () => {
  return (
    <div className="relative  bg-gradient-to-br from-gray-100 to-purple-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SupportOurMissionHeader
          title="Support Our Mission"
          description="Make a monthly donation and earn your VIP badge. Your ongoing support helps us provide veterinary care to pets in need."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donationTiers.map((tier) => (
            <SupportOurMissionCard key={tier.id} tier={tier} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DonationSection);
