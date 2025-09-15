import { motion } from "framer-motion";
import React from "react";
interface IProps {
  onClick: () => void;
}
const PostCallReviewSupportSection: React.FC<IProps> = ({ onClick }) => {
  return (
    <div className=" rounded-xl p-5 text-white text-center">
      <div className="text-4xl mb-3">💝</div>
      <h3 className="text-xl font-bold mb-2">Support Our Mission</h3>
      <p className="text-sm mb-4 opacity-90 leading-tight">
        Help us continue providing quality veterinary care to pets everywhere.
      </p>
      <motion.button
        whileHover={{
          y: -1,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderColor: "rgba(255, 255, 255, 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="bg-[rgba(255,255,255,0.2)] text-white border-2 border-[rgba(255,255,255,0.3)] rounded-lg py-3 px-6 text-base font-semibold cursor-pointer transition-all w-full"
      >
        Make a Donation
      </motion.button>
    </div>
  );
};

export default React.memo(PostCallReviewSupportSection);
