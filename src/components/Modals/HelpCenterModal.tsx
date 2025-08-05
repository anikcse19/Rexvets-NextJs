import { AnimatePresence, motion } from "framer-motion";
import React, { Dispatch, SetStateAction } from "react";

interface HelpCenterModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Help Center
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 max-w-md"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <h2 className="text-xl font-bold mb-4">Help Center</h2>
              <p className="text-gray-600 mb-4">
                {greeting},! We’re here to assist you. For support, please visit
                our{" "}
                <a href="/support" className="text-blue-500 hover:underline">
                  Support Page
                </a>
                .
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpCenterModal;
