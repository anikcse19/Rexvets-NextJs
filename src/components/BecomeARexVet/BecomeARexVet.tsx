"use client";
import { Calendar, Heart, PawPrint, Star } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  MdAssignment,
  MdCalendarToday,
  MdMessage,
  MdPets,
  MdPhone,
  MdSecurity,
  MdSupport,
  MdVerified,
  MdVideoCall,
} from "react-icons/md";
import BComeRexVetHeroSection from "./BComeRexVetHeroSection";
import BeComeHowItWorksSection from "./BeComeHowItWorksSection";
import BecomeRexVetBenefitsTableSection from "./BecomeRexVetBenefitsTableSection";
import BecomeRexVetFeaturesSection from "./BecomeRexVetFeaturesSection";
import BecomeRexVetPlatformFeaturesSection from "./BecomeRexVetPlatformFeaturesSection";
import BecomeRexVetStatsCTASection from "./BecomeRexVetStatsCTASection";
import { howItWorksBecomePlatformOverviewData } from "./become.data";

const BecomeARexVet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const benefits = useMemo(
    () => [
      {
        feature: "Dedicated Service Page",
        description: "Unique profile and URL to promote your virtual practice",
        rexVets: true,
        others: false,
      },
      {
        feature: "Promotion on RexVets.com",
        description:
          "Promotion to new clients seeking help in RexVets's marketplace",
        rexVets: true,
        others: false,
      },
      {
        feature: "Online Booking",
        description:
          "Clients can easily find you, and can book one or multiple visits",
        rexVets: true,
        others: false,
      },
      {
        feature: "Integrated Schedule",
        description:
          "Integrate with your iCal or Gcal, and pause your availability whenever you need to",
        rexVets: true,
        others: false,
      },
      {
        feature: "Helpful Reminders",
        description:
          "Never miss a call, with pre-appointment SMS & email alerts",
        rexVets: true,
        others: false,
      },
      {
        feature: "Video Calls",
        description: "Secure, private video calls with in-app features",
        rexVets: true,
        others: false,
      },
      {
        feature: "In-app messaging",
        description: "1:1 messaging with clients 24 hours post appointment",
        rexVets: true,
        others: false,
      },
      {
        feature: "RexVets Prescribing",
        description: "Freeform and pharmacy-integrated options",
        rexVets: true,
        others: false,
      },
      {
        feature: "Client Feedback & Reviews",
        description: "Capture regular feedback from clients",
        rexVets: true,
        others: false,
      },
    ],
    []
  );

  const features = useMemo(
    () => [
      {
        icon: <MdSecurity fontSize="large" color="white" size={29} />,
        title: "Mission-Driven Work",
        description:
          "Treat animals in underserved communities or support pet owners in crisis. Every consult helps fund our nonprofit model and expands access to care.",
        gradient: "bg-gradient-to-tr from-indigo-500 to-purple-500", // Tailwind gradient
      },
      {
        icon: <MdPets fontSize="large" color="white" size={29} />,
        title: "Clinical Autonomy",
        description:
          "You decide your medical recommendations with no corporate pressure or product quotas. Focus on care, not sales.",
        gradient: "bg-gradient-to-tr from-cyan-500 to-green-500",
      },
      {
        icon: <MdSupport fontSize="large" color="white" size={29} />,
        title: "Support When You Need It",
        description:
          "Our peer support network and clinical team are always available to back you up.",
        gradient: "bg-gradient-to-tr from-amber-500 to-red-500",
      },
    ],
    []
  );

  const platformFeatures = useMemo(
    () => [
      {
        icon: <MdVideoCall />,
        title: "Video & Chat Built for Vets",
        description:
          "Connect with clients securely using integrated tools designed specifically for veterinary care.",
      },
      {
        icon: <MdAssignment />,
        title: "Streamlined Records & Notes",
        description:
          "Easily document consults, upload photos, manage SOAPs, and access histories in one place.",
      },
      {
        icon: <MdMessage />,
        title: "Client-Friendly Messaging",
        description:
          "Message clients directly for updates or follow-up. Keep communication organized and private.",
      },
      {
        icon: <MdCalendarToday />,
        title: "Smart Scheduling",
        description:
          "Set your own schedule and consult when it works for you. We handle all the logistics.",
      },
      {
        icon: <MdPhone />,
        title: "24/7 Support",
        description:
          "Our support team is always available to help you provide the best care possible.",
      },
      {
        icon: <MdVerified />,
        title: "Secure Platform",
        description:
          "HIPAA compliant with enterprise-grade security to protect your practice and clients.",
      },
    ],
    []
  );

  const stats = useMemo(
    () => [
      // Full stats array from original
      {
        title: "Extended Hours",
        value: "40%",
        description: "of consultations happen after hours",
        icon: <Calendar className="w-8 h-8" />,
        color: "text-blue-600",
      },
      {
        title: "Remote Pets",
        value: "30%",
        description: "of visits support pets in remote areas",
        icon: <PawPrint className="w-8 h-8" />,
        color: "text-purple-600",
      },
      {
        title: "Species Treated",
        value: "25+",
        description: "different species treated on platform",
        icon: <Heart className="w-8 h-8" />,
        color: "text-blue-400",
      },
      {
        title: "Client Loyalty",
        value: "85%+",
        description: "return again for additional consults",
        icon: <Star className="w-8 h-8" />,
        color: "text-green-600",
      },
    ],
    []
  );
  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <BComeRexVetHeroSection isVisible={isVisible} />
      <BeComeHowItWorksSection
        isVisible={isVisible}
        platformFeatures={platformFeatures}
        platformFeaturesOverview={howItWorksBecomePlatformOverviewData}
      />
      <BecomeRexVetFeaturesSection isVisible={isVisible} features={features} />
      <BecomeRexVetPlatformFeaturesSection isVisible={isVisible} />
      <BecomeRexVetBenefitsTableSection benefits={benefits} />
      <BecomeRexVetStatsCTASection isVisible={isVisible} stats={stats} />
      {/* <FinalCTASection /> */}
    </div>
  );
};

export default BecomeARexVet;
