"use client";
import { motion } from "framer-motion";
import React from "react";

interface IProps {
  socialLinks: any[];
}

const FooterSocialLinks: React.FC<IProps> = ({ socialLinks }) => {
  return (
    <div>
      <h4 className="mb-4 text-lg font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
        Connect With Us
      </h4>
      <div className="flex flex-wrap">
        {socialLinks.map((social, index) => {
          const IconComponent = social.icon;
          return (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              whileHover={{
                y: -4,
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(251, 191, 36, 0.4)",
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="mr-2 mb-2 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 backdrop-blur-md transition-colors hover:border-amber-400 hover:bg-amber-400 hover:text-gray-900"
            >
              <IconComponent size={22} />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(FooterSocialLinks);
