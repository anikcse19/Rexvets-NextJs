"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
interface IProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}
const PostCallReviewModalContainer: React.FC<IProps> = ({
  children,
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#002366] flex items-center justify-center z-[10000] font-inter overflow-auto p-2.5 box-border"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#2E2A5D] rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-auto shadow-xl border-2 border-gray-400 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(PostCallReviewModalContainer);
