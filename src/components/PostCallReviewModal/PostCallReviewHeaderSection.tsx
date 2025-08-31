import { motion } from "framer-motion";
import React from "react";
import { RxCross1 } from "react-icons/rx";
interface IProps {
  onClose: () => void;
}
const PostCallReviewHeaderSection: React.FC<IProps> = ({ onClose }) => {
  return (
    <div className="bg-[#120F2C] p-5 rounded-t-2xl text-white text-center relative">
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 bg-[rgba(255,255,255,0.2)] text-white border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer text-base transition-all"
      >
        <RxCross1 />
      </motion.button>
      <div className="w-16 h-16 bg-[rgba(255,255,255,0.2)] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
        ✅
      </div>
      <h1 className="text-2xl font-bold mb-2 text-shadow-md">
        Thank You for Your Consultation!
      </h1>
      <p className="text-base opacity-90 leading-tight">
        Your feedback helps us provide the best care for pets everywhere.
      </p>
    </div>
  );
};

export default React.memo(PostCallReviewHeaderSection);
