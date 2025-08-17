"use client";
import { motion } from "framer-motion";
import React, { FC } from "react";
import { ISupportStayConnectedData } from "./support.interface";
interface IProps {
  title: string;
  description: string;
  links: ISupportStayConnectedData[];
}

const SupportStayConnected: FC<IProps> = ({
  title,
  description,
  links = [],
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6 }}
      className="bg-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6 py-12 text-center mt-8"
    >
      <h3 className="text-2xl font-bold text-white drop-shadow-md mb-3">
        {title}
      </h3>
      <p className="text-white/90 text-lg mb-4">{description}</p>
      <div className="flex justify-center gap-4">
        {links.map(({ icon, link }, index) => {
          return (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-xl border border-white/40 shadow-md hover:bg-white/90 hover:-translate-y-1 hover:scale-110 hover:shadow-xl transition-all duration-300"
            >
              {icon}
            </a>
          );
        })}
      </div>
    </motion.div>
  );
};

export default React.memo(SupportStayConnected);
