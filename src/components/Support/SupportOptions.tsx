import { motion } from "framer-motion";
import React from "react";
import { supportCardVariants, supportHoverEffect } from "./animation.config";
import { ISupportOption } from "./support.interface";

interface IProps {
  options: ISupportOption[];
}

const SupportOptions: React.FC<IProps> = ({ options }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {options.map((option, index) => (
        <motion.div
          key={index}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={supportCardVariants}
          transition={{ delay: index * 0.2 }}
          whileHover={supportHoverEffect}
          className="bg-white/98 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600" />
          <div className="p-6 text-center flex flex-col h-full">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              {option.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {option.title}
            </h3>
            <p className="text-gray-600 flex-grow mb-4">{option.description}</p>
            {option.onClick ? (
              <motion.button
                onClick={() => alert("support clicked")}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-[rgb(102,126,234)] to-[rgb(118,75,162)] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300"
              >
                {option.action}
              </motion.button>
            ) : option.href ? (
              <motion.a
                href={option.href}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-[rgb(102,126,234)] to-[rgb(118,75,162)] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300"
              >
                {option.action}
              </motion.a>
            ) : (
              <motion.a
                href={option?.link}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-[rgb(102,126,234)] to-[rgb(118,75,162)] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300"
              >
                {option.action}
              </motion.a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SupportOptions;
