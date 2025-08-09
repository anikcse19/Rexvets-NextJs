/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import FooterSectionTitle from "./FooterSectionTitle";
interface IProps {
  links: any[];
}
const FooterQuickLinks: React.FC<IProps> = ({ links }) => (
  <div>
    <FooterSectionTitle>Quick Links</FooterSectionTitle>
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
export default React.memo(FooterQuickLinks);
