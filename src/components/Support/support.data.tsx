import { FaQuestionCircle } from "react-icons/fa";
import {
  FaComment,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa6";
import { ISupportOption, ISupportStayConnectedData } from "./support.interface";

export const stayConnectedData: ISupportStayConnectedData[] = [
  {
    link: "https://www.facebook.com/profile.php?id=61565972409402",
    icon: <FaFacebookF className="text-blue-600 text-2xl" />,
  },
  {
    link: "https://www.instagram.com/rexvets/",
    icon: <FaInstagram className="text-pink-500 text-2xl" />,
  },
];
export const supportOptions: ISupportOption[] = [
  {
    icon: <FaQuestionCircle className="text-4xl text-white" />,
    title: "Help Center",
    description:
      "Our self-help center is available 24/7 with frequently asked questions, how-to guides, and comprehensive articles about the Rex Vets platform.",
    action: "Find Answers",
    link: "/faq",
  },
  {
    icon: <FaComment className="text-4xl text-white" />,
    title: "Live Chat",
    description:
      "Start a conversation with our AI assistant or connect with a real support specialist for immediate assistance.",
    action: "Chat Now",
    onClick: () => {}, // Placeholder, will be passed via props
  },
  {
    icon: <FaEnvelope className="text-4xl text-white" />,
    title: "Email Support",
    description:
      "Send us detailed questions about platform features, account issues, or technical problems for comprehensive support.",
    action: "Email Us",
    href: "mailto:support@rexvet.org?subject=Support Request&body=Describe your issue here",
  },
];
