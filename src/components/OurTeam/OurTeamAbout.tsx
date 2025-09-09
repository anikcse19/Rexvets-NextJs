"use client";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import React from "react";
import OurTeamHeroSection from "./OurTeamHeroSection";
import OurTeamLeadershipSection from "./OurTeamLeadershipSection";
import OurTeamStorySection from "./OurTeamStorySection";

interface Gradients {
  primary: string;
  secondary: string;
  accent: string;
  gold: string;
}

interface HeroData {
  coverImage: string;
  chipLabel: string;
  title1: string;
  title2: string;
  subtitle: string;
  gradients: Gradients;
}

interface StoryData {
  images: {
    about1: string;
    about2: string;
  };
  title: string;
  titleHighlight: string;
  subtitle1: string;
  subtitle2: string;
  gradients: Gradients;
}

interface Leader {
  name: string;
  title: string;
  description: string;
  image: string;
  icon: "School" | "Psychology";
  gradient: string;
}

interface LeadershipData {
  chipLabel: string;
  title: string;
  subtitle: string;
  leaders: Leader[];
  gradients: Gradients;
}
const bounceAnimation: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};
const OurTeamAbout: React.FC = () => {
  const gradients: Gradients = {
    primary: "from-[#667eea] to-[#764ba2]",
    secondary: "from-[#f093fb] to-[#f5576c]",
    accent: "from-[#4facfe] to-[#00f2fe]",
    gold: "from-[#ffecd2] to-[#fcb69f]",
  };

  const heroData: HeroData = {
    coverImage: "/images/our-team/AboutUsCover.webp",
    chipLabel: "About Rex Vet",
    title1: "Bringing Joy to",
    title2: "Every Paw & Heart",
    subtitle:
      "Transforming veterinary care through innovation, compassion, and accessibility",
    gradients,
  };

  const storyData: StoryData = {
    images: {
      about1: "/images/our-team/About1.webp",
      about2: "/images/our-team/About2.webp",
    },
    title: "Building bonds that last a",
    titleHighlight: "lifetime,",
    subtitle1:
      "At Rex Vet, our mission is to increase access to veterinary care for all pets regardless of their family's financial or geographic limitations. Too often, animals end up in shelters or suffer from preventable, late-stage medical conditions simply because timely care wasn't available.",
    subtitle2:
      "We believe that early and consistent veterinary care is not only essential for animal health but also critical to strengthening the human animal bond. By making care more accessible, we're improving the lives of pets—and the people who love them.",
    gradients,
  };

  const leadershipData: LeadershipData = {
    chipLabel: "👑 Leadership",
    title: "Exploring Our Leadership",
    subtitle:
      "Meet the visionary leaders driving innovation in veterinary care",
    leaders: [
      {
        name: "Tiffany Delacruz",
        title: "Chief Executive Officer",
        description:
          "Tiffany Delacruz, the CEO of Rex Vet, is a licensed veterinarian with a profound dedication to preventive medicine, striving to enhance the well-being of pets. With extensive experience in veterinary practice, Tiffany possesses a comprehensive understanding of the concerns of pet owners and their beloved companions. Under her astute leadership, Rex Vet has emerged as a renowned entity in the veterinary realm.",
        image: "/images/our-team/CEO.webp",
        icon: "School",
        gradient: gradients.accent,
      },
      {
        name: "Johnny Dominguez",
        title: "Founder",
        description:
          "Johnny Dominguez is the visionary founder behind Rex Vet. With a doctorate in computer science philosophy and a lifelong love for animals, Johnny set out to reimagine how pet families access care. Driven by a passion for innovation and compassion, he built Rex Vet to make veterinary support more accessible, especially for those who need it most.",
        image: "/images/our-team/Founder.webp",
        icon: "Psychology",
        gradient: gradients.secondary,
      },
      {
        name: "Erick Martinez",
        title: "Director",
        description:
          "Born in France, Erick Martinez brings over 30 years of experience in logistics, manufacturing, and operations.He has held leadership roles across factory management and the pet supplement industry, with a strong focus on efficiency and quality.His deep expertise in supply chain and production helps ensure our services and products reach pet owners reliably and at scale.Erick is passionate about innovation in animal health and expanding access to trusted pet care solutions.",
        image: "/images/our-team/director.webp",
        icon: "School",
        gradient: gradients.primary,
      },
    ],
    gradients,
  };

  return (
    <div className="overflow-hidden">
      {/* Floating Paw Heart with Framer Motion */}
      <motion.div
        variants={bounceAnimation}
        animate="animate"
        className="fixed top-12 md:top-14 right-5 md:right-24 z-[50]"
      >
        <Image
          src={"/images/our-team/PawHeart.webp"}
          alt="Paw Heart"
          width={120}
          height={120}
          className="w-20 md:w-32 drop-shadow-[0_10px_30px_rgba(79,172,254,0.4)]"
        />
      </motion.div>

      <OurTeamLeadershipSection {...leadershipData} />
      <OurTeamHeroSection {...heroData} />
      <OurTeamStorySection {...storyData} />
    </div>
  );
};

export default React.memo(OurTeamAbout);
