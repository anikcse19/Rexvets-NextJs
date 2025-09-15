import { motion } from "framer-motion";
import React from "react";
import { RxCross1 } from "react-icons/rx";
interface IProps {
  onClose: () => void;
}
const PostCallReviewHeaderSection: React.FC<IProps> = ({ onClose }) => {
  return (
    <div className=" md:p-5 p-2 rounded-t-2xl text-white text-center relative">
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
