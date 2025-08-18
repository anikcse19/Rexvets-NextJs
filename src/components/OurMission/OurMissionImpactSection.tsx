"use client";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MdVolunteerActivism } from "react-icons/md";

interface OurMissionImpactProps {
  // Text
  title?: string;
  subtitle?: string;
  impactItems?: string[];

  // Image
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;

  // CTA Link
  ctaHref?: string;
  ctaLabel?: string;
  ctaIcon?: React.ReactNode;

  // Styling
  backgroundGradient?: string;
  className?: string;
}

const OurMissionImpactSection: React.FC<OurMissionImpactProps> = ({
  // Defaults from current content
  title = "The Impact of Your Support",
  subtitle = "As a non-profit organization, we rely on the generosity of our community to continue providing affordable telehealth services. Every donation helps us:",
  impactItems = [
    "Keep our telehealth services affordable for all families",
    "Fund essential medical supplies and cutting-edge technology",
    "Support outreach programs that educate and promote animal welfare",
  ],
  imageSrc = "/images/mission/dog.webp",
  imageAlt = "Pet Care Impact",
  imageWidth = 600,
  imageHeight = 400,
  ctaHref = "/DonatePage2",
  ctaLabel = "Making a Difference",
  ctaIcon = <MdVolunteerActivism size={24} color={"#2B9159"} />,
  backgroundGradient = "bg-[linear-gradient(135deg,_rgb(240,147,251)_0%,_rgb(245,87,108)_100%)]",
  className = "",
}) => {
  // Fade animation for left section
  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  // Zoom animation for list items
  const zoomIn = (delay: number): Variants => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut", delay: delay },
    },
  });

  // Slide-left animation for right section
  const slideLeft: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  return (
    <div className={cn("py-6 md:py-12", backgroundGradient, className)}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left Section (Text) */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            {/* Heading */}
            <h2
              className="
                text-2xl 
                md:text-[48px] 
                font-bold 
                text-white 
                mb-3 
                leading-[58px] 
                font-inter"
            >
              {title}
            </h2>

            {/* Subheading */}
            <p
              className="
                text-lg 
                md:text-xl 
                text-[rgba(255,255,255,0.9)] 
                mb-4 
                font-normal 
                font-inter 
                mt-4
                "
            >
              {subtitle}
            </p>

            {/* List Items */}
            <div className="mb-4">
              {impactItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={zoomIn(index * 0.2)}
                  className="
                    flex 
                    items-center 
                    mb-3 
                    p-2 
                    py-5
                    rounded-lg 
                    bg-[rgba(255,255,255,0.1)] 
                    backdrop-blur-md 
                    border 
                    border-[rgba(255,255,255,0.2)] 
                    transition-transform 
                    duration-300 
                    hover:translate-x-2"
                >
                  <div
                    className="
                      w-10 
                      h-10 
                      bg-[rgba(255,255,255,0.2)] 
                      text-white 
                      font-bold 
                      flex 
                      items-center 
                      justify-center 
                      rounded-full 
                      mr-2"
                  >
                    {index + 1}
                  </div>
                  <p className="text-white text-base font-medium font-inter">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <div
              className="
                p-3 
                rounded-lg 
                bg-[rgba(255,255,255,0.95)] 
                backdrop-blur-xl 
                border 
                border-[rgba(255,255,255,0.3)]"
            >
              <p
                className="
                  text-[#002261] 
                  font-bold 
                  italic 
                  text-center 
                  text-lg 
                  font-inter"
              >
                &quot;Together, we can make a difference, one virtual visit at a
                time.&quot;
              </p>
            </div>
          </motion.div>

          {/* Right Section (Image) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideLeft}
            className="
              rounded-lg 
              overflow-hidden 
              relative 
              shadow-[0_25px_60px_rgba(0,0,0,0.3)]"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              className="w-full h-auto block transition-transform duration-500 hover:scale-105"
            />
            <Link
              href={ctaHref}
              className="
                absolute 
                bottom-5 
                left-5 
                bg-[rgba(255,255,255,0.9)] 
                rounded-lg 
                p-4
                backdrop-blur-md 
                flex 
                items-center 
                gap-2 
                hover:bg-[rgba(255,255,255,0.6)] 
                hover:border-2 
                hover:border-white 
                transition-all 
                duration-300"
            >
              {ctaIcon}
              <span
                className="
                  text-[#002261] 
                  font-bold 
                  text-base 
                  font-inter"
              >
                {ctaLabel}
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OurMissionImpactSection;
