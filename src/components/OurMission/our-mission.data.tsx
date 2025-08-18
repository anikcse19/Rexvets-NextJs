import { FaRocket, FaStar, FaUsers } from "react-icons/fa6";
import { IWeAimFeatures } from "./our.mission.interface";

export const weAimFeatures: IWeAimFeatures[] = [
  {
    icon: FaRocket,
    title: "Expand Access",
    description:
      "Provide cutting-edge telehealth services to pets and families who might otherwise go without care.",
    gradient: "bg-gradient-to-br from-[rgb(79,172,254)] to-[rgb(0,242,254)]",
    delay: 0.2,
  },
  {
    icon: FaUsers,
    title: "Support Communities",
    description:
      "Focus on underserved communities, offering education and resources to promote better pet health.",
    gradient: "bg-gradient-to-br from-[rgb(25,118,210)] to-[rgb(156,39,176)]",
    delay: 0.4,
  },
  {
    icon: FaStar,
    title: "Promote Compassion",
    description:
      "Ensure that every pet owner feels supported, understood, and empowered to care for their beloved animals.",
    gradient: "bg-gradient-to-br from-[rgb(102,126,234)] to-[rgb(118,75,162)]",
    delay: 0.6,
  },
];
