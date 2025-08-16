import { Calendar, HelpingHand, TrendingUp } from "lucide-react";
import { IBecomePlatformOverview } from "./become.type";

export const howItWorksBecomePlatformOverviewData: IBecomePlatformOverview[] = [
  {
    title: "Set your schedule. We handle the logistics.",
    description:
      "Select your availability from one hour a week to full days. No chasing clients, no collecting payments, no appointment setup.",
    icon: <Calendar className="w-6 h-6" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Fair, standardized pay.",
    description:
      "Competitive compensation at a standardized rate per consult, targeting $80/hour. Focus on providing care; we ensure fair payment.",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "One unified community.",
    description:
      "Join Rex Vets' mission-driven network improving access to care. We support each other and grow together.",
    icon: <HelpingHand className="w-6 h-6" />,
    color: "bg-purple-100 text-purple-600",
  },
];
