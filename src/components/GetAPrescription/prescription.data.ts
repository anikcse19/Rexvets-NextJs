"use client";
import { FaMobileAlt } from "react-icons/fa";
import { FaPills, FaTruck, FaUserCheck } from "react-icons/fa6";
import { IPrescriptionFeature, IPrescriptionStep } from "./types.prescription";

export const prescriptionSteps: IPrescriptionStep[] = [
  {
    number: "1",
    title: "Browse Products",
    description: "Browse through our extensive collection of pet products.",
  },
  {
    number: "2",
    title: "Add to Cart",
    description: "Add your desired items to the cart and proceed to checkout.",
  },
  {
    number: "3",
    title: "Fast Delivery",
    description: "Enjoy fast and reliable delivery right to your doorstep.",
  },
];
export const prescriptionHeroSectionTabs: string[] = [
  "Trusted",
  "Licensed",
  "24/7 Available",
  "Secure",
];
export const prescriptionFeatures: IPrescriptionFeature[] = [
  {
    icon: FaTruck,
    title: "Free Shipping",
    description: "Free standard shipping on orders over $49",
    color: "bg-emerald-500",
  },
  {
    icon: FaPills,
    title: "Prescription Available",
    description: "Prescriptions available in selected states",
    color: "bg-blue-500",
  },
  {
    icon: FaMobileAlt,
    title: "24/7 Availability",
    description: "24/7 on-demand, online vet appointments",
    color: "bg-purple-500",
  },
  {
    icon: FaUserCheck,
    title: "Licensed Veterinarians",
    description: "Choose from thousands of licensed vets",
    color: "bg-amber-500",
  },
];
