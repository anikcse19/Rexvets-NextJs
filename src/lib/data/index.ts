import {
  MdFavorite,
  MdHome,
  MdMonetizationOn,
  MdSchedule,
  MdSchool,
  MdSupport,
} from "react-icons/md";
import featureImage1 from "../../../public/images/Homepage/featureImage1-1.webp";
import featureImage2 from "../../../public/images/Homepage/featureImage2-2.webp";
import featureImage3 from "../../../public/images/Homepage/featureImage3-3.webp";
import marquee1 from "../../../public/images/Homepage/marquee1.webp";
import marquee2 from "../../../public/images/Homepage/marquee2.webp";
import marquee3 from "../../../public/images/Homepage/marquee3.webp";
import marquee4 from "../../../public/images/Homepage/marquee4.webp";
import { IBrand, IFeature, IHomeFeaturesSection } from "../interfaces";
export const brands: IBrand[] = [
  { id: 2, name: "HUFFPOST", imageUrl: marquee4 },
  { id: 3, name: "TechCrunch", imageUrl: marquee3 },
  { id: 4, name: "yahoo!news", imageUrl: marquee1 },
  { id: 5, name: "THE GLOBE AND MAIL", imageUrl: marquee2 },
];
export const doubledBrands = [...brands, ...brands];
export const features: IFeature[] = [
  {
    title: "Find the Right Vet",
    description:
      "Browse verified vet profiles, read authentic reviews, and choose the perfect match for your pet's unique needs and personality.",
    image: featureImage1,
    icon: "🔍",
    color: "#3b82f6",
    chip: "Verified Profiles",
    number: "01",
  },
  {
    title: "Expert Care 24/7",
    description:
      "Connect with licensed veterinarians anytime through secure messaging, video consultations, or emergency support.",
    image: featureImage2,
    icon: "🩺",
    color: "#8b5cf6",
    chip: "Always Available",
    number: "02",
  },
  {
    title: "Online Prescriptions",
    description:
      "Access hundreds of medications through RexRx with fast delivery options or convenient local pharmacy pickup.",
    image: featureImage3,
    icon: "💊",
    color: "#06b6d4",
    chip: "Fast Delivery",
    number: "03",
  },
];
export const whyChooseFeaturesData: IHomeFeaturesSection[] = [
  {
    id: 1,
    icon: MdMonetizationOn, // 👈 just the component reference
    title: "Affordable Care",
    description:
      "Accessible virtual consultations with licensed veterinarians.",
    color: "#4CAF50",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
  },
  {
    id: 2,
    icon: MdHome,
    title: "Convenience",
    description: "Get expert advice from the comfort of your home.",
    color: "#2196F3",
    gradient: "linear-gradient(135deg, #2196F3 0%, #1565C0 100%)",
  },
  {
    id: 3,
    icon: MdFavorite,
    title: "Impact",
    description:
      "Every visit and donation helps us serve more pets in need, especially in underserved communities.",
    color: "#E91E63",
    gradient: "linear-gradient(135deg, #E91E63 0%, #AD1457 100%)",
  },
  {
    id: 4,
    icon: MdSupport,
    title: "Supporting a Cause",
    description:
      "Donations fund emergency treatments, giving pets a chance at a healthy life.",
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
  },
  {
    id: 5,
    icon: MdSchedule,
    title: "24/7 Availability",
    description:
      "Round-the-clock access to consultations, ensuring support at any time.",
    color: "#9C27B0",
    gradient: "linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)",
  },
  {
    id: 6,
    icon: MdSchool,
    title: "Education",
    description:
      "Empowering pet owners with knowledge to make informed decisions about their pets' health.",
    color: "#00BCD4",
    gradient: "linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)",
  },
];
