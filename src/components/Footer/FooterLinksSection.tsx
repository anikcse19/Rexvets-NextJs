"use client";
import Link from "next/link";
import React from "react";
import { IoArrowForward } from "react-icons/io5";

interface FooterLink {
  to: string;
  text: string;
}

interface IProps {
  title: string;
  links: FooterLink[];
}

const FooterLinksSection: React.FC<IProps> = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-[3px] after:bg-gradient-to-r from-yellow-500 to-yellow-600 after:rounded">
        {title}
      </h3>
      <div className="space-y-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.to}
            className="flex items-center gap-2.5 text-white/80 text-base py-2 hover:text-yellow-500 hover:translate-x-3 hover:pl-3 transition-all duration-300 rounded-md"
          >
            <IoArrowForward className="text-sm" />
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default React.memo(FooterLinksSection);
