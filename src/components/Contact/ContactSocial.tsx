"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

interface SocialLink {
  icon: React.ElementType;
  label: string;
  handle: string;
  link: string;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: Instagram,
    label: "Follow us on Instagram",
    handle: "@rexvets",
    link: "https://www.instagram.com/rexvets/",
    color: "#e1306c",
  },
  {
    icon: Facebook,
    label: "Like us on Facebook",
    handle: "@rexvets",
    link: "https://www.facebook.com/profile.php?id=61565972409402",
    color: "#1877f2",
  },
  {
    icon: Mail, // Replaced TikTok with Mail due to lack of direct TikTok icon in lucide-react
    label: "Follow us on TikTok",
    handle: "@rexvets",
    link: "https://www.tiktok.com/@rexvets",
    color: "#000000",
  },
  {
    icon: Phone,
    label: "Call us directly",
    handle: "1 (888) 808-0495",
    link: "tel:+18888080495",
    color: "#10b981",
  },
  {
    icon: Mail,
    label: "Send us an email",
    handle: "support@rexvets.com",
    link: "mailto:support@rexvets.com",
    color: "#3b82f6",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const ContactSocial: React.FC = () => {
  return (
    <div className="sticky top-24">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center lg:text-left">
        Connect With Us
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {socialLinks.map((social, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card className="rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200/50 hover:-translate-y-1 hover:scale-102 hover:shadow-xl transition-all duration-300">
              <Link
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className="text-2xl transition-transform duration-300"
                    style={{ color: social.color }}
                  >
                    <social.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {social.label}
                    </p>
                    <p className="text-sm text-gray-600">{social.handle}</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <motion.div variants={buttonVariants} className="mt-8">
        <Card className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2">Need Immediate Help?</h3>
            <p className="text-sm opacity-90 mb-4">
              For urgent pet health concerns, don't hesitate to reach out
              immediately.
            </p>
            <Button
              asChild
              variant="outline"
              className="bg-white/20 text-white border border-white/30 rounded-full px-6 py-2 hover:bg-white/30"
            >
              <Link href="tel:+18888080495">
                Call Now
                <Phone className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
export default React.memo(ContactSocial);
