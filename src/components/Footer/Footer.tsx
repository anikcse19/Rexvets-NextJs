import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Facebook,
  Heart,
  Instagram,
  Mail,
  Shield,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { FaTiktok } from "react-icons/fa";
import FooterBrandSection from "./FooterBrandSection";
import FooterContactCard from "./FooterContactCard";
import FooterQuickLinks from "./FooterQuickLinks";
import FooterSocialLinks from "./FooterSocialLinks";
import FooterTrustBadgeCard from "./FooterTrustBadgeCard";

// Define the type for a link
interface LinkType {
  to: string;
  text: string;
}

declare global {
  interface Window {
    gnp_request: {
      slug: string;
      "color-set": number;
      campaign: number;
    };
  }
}

const Footer = React.memo(() => {
  const sitemapLinks = useMemo(
    () => [
      { to: "/", text: "Home" },
      { to: "/PetParents", text: "For pet parents" },
      { to: "/VetandTechs", text: "For Vet & techs" },
      { to: "/About", text: "About" },
      { to: "/Blogs", text: "Blogs" },
      { to: "/Support", text: "Support" },
    ],
    []
  );

  const usefulLinks: LinkType[] = useMemo(
    () => [
      { to: "/NonProfitPage", text: "Non Profit Status" },
      { to: "/SupportUs", text: "Support Us" },
      { to: "/FinancialTransparency", text: "Financial Transparency" },
      { to: "/PrivacyPolicy", text: "Privacy Policy" },
      { to: "/RefundPolicy", text: "Refund Policy" },
      { to: "/TermsandConditions", text: "Terms and Conditions" },
    ],
    []
  );

  const socialLinks = useMemo(
    () => [
      {
        href: "https://www.instagram.com/rexVet",
        icon: Instagram,
        label: "Instagram",
      },
      {
        href: "https://www.facebook.com/profile.php?id=61565972409402",
        icon: Facebook,
        label: "Facebook",
      },
      {
        href: "https://www.tiktok.com/@rexVet",
        icon: FaTiktok,
        label: "TikTok",
      },
      {
        href: "mailto:support@rexVet.com",
        icon: Mail,
        label: "Email",
      },
    ],
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ Avoid SSR crash
    const script = document.createElement("script");
    script.src = "https://greatnonprofits.org/js/api/badge_toprated.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    window.gnp_request = {
      slug: "rex-Vet-inc",
      "color-set": 1,
      campaign: 66,
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #41496E 50%, #6B6086 50%, #4A5568 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
          `,
        }}
      />
      <div className="relative z-10 mx-auto  3xl:max-w-screen-3xl px-4 py-12 md:py-20">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 lg:col-span-5">
            <FooterBrandSection />
            <FooterContactCard />
            <FooterSocialLinks socialLinks={socialLinks} />
            <FooterTrustBadgeCard
              title="Transparency Verified"
              sub_title=" Top Rated 2025"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <FooterQuickLinks links={sitemapLinks} />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <LegalLinks links={usefulLinks} />
          </div>
        </div>
        <hr className="my-10 border-white/20" />
        <BottomSection />
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;

const LegalLinks = ({ links }: { links: LinkType[] }) => (
  <div>
    <SectionTitle>Legal & Support</SectionTitle>
    <div className="flex flex-col space-y-1">
      {links.map((link, index) => (
        <motion.div
          key={index}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={link.to}
            className="flex items-center gap-2.5 rounded-md py-2 text-sm text-white/80 no-underline transition-all hover:pl-3 hover:text-amber-400"
          >
            <ArrowRight size={16} />
            {link.text}
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="relative mb-6 text-xl font-bold tracking-tight text-white after:absolute after:bottom-[-8px] after:left-0 after:h-[3px] after:w-10 after:rounded after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
    {children}
  </h3>
);

const BottomSection = () => (
  <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
    <div className="flex flex-wrap justify-center gap-3 md:justify-start">
      <div className="inline-flex items-center gap-1 rounded-full border border-green-400/30 bg-green-400/20 px-3 py-1 text-xs font-medium text-green-400 backdrop-blur-md md:text-sm">
        <Shield size={14} />
        Trusted Non-Profit
      </div>
      <div className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/20 px-3 py-1 text-xs font-medium text-amber-400 backdrop-blur-md md:text-sm">
        <Award size={14} />
        Top Rated 2025
      </div>
      <div className="inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-400/20 px-3 py-1 text-xs font-medium text-blue-400 backdrop-blur-md md:text-sm">
        <CheckCircle size={14} />
        24/7 Available
      </div>
    </div>
    <p className="flex flex-wrap items-center justify-center gap-1 text-sm text-white/80 md:justify-end md:text-base [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
      Made with
      <Heart size={16} fill="#fbbf24" color="#fbbf24" />
      for ©{new Date().getFullYear()} Rex Vet. All rights reserved.
    </p>
  </div>
);