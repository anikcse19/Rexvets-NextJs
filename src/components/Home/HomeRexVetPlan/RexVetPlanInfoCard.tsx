import { motion } from "framer-motion";
import React from "react";
import {
  IoCheckmarkCircle,
  IoPeopleOutline,
  IoShieldOutline,
  IoSparkles,
  IoTimeOutline,
} from "react-icons/io5";
import { Badge } from "../../ui/badge";
interface IProps {
  sharedFeatures: string[];
}
const RexVetPlanInfoCard: React.FC<IProps> = ({ sharedFeatures }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Badge */}
      <Badge className="mb-3 bg-gradient-to-br from-indigo-200/50 rounded-full py-2 px-5 to-purple-200/50 border border-indigo-300/50 text-indigo-800 font-semibold">
        <IoSparkles className="mr-1" /> Flexible Veterinary Care
      </Badge>

      {/* Main Headline */}
      <h2 className="text-2xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-600 mb-3 leading-tight">
        Choose the{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-red-600 font-extrabold">
          RexVet Plan
        </span>{" "}
        that fits your lifestyle.
      </h2>

      <p className="text-base lg:text-xl text-gray-600 mb-4 leading-relaxed">
        Whether you prefer{" "}
        <strong className="text-gray-900 ">pay-as-you-go flexibility</strong> or{" "}
        <strong className="text-gray-900 ">
          unlimited access with savings
        </strong>
        , we have the perfect veterinary care solution for you and your pets.
      </p>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
            <IoCheckmarkCircle className="text-white text-sm" />
          </div>
          <h3 className="text-[19px] font-bold text-gray-900">
            What&apos;s always included with both plans:
          </h3>
        </div>

        <div className="space-y-2">
          {sharedFeatures.map((text, index) => (
            <motion.div
              key={index}
              className="flex items-start mt-5 space-x-2 hover:translate-x-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.2 }}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center mt-0.5">
                <IoCheckmarkCircle className="text-white text-xs" />
              </div>
              <p className=" text-base md:text-lg font-garet text-gray-600 leading-relaxed text-justify flex-1">
                {text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col lg:flex-row gap-3 mt-6 pt-4">
          <div className="flex items-center space-x-1">
            <IoPeopleOutline className="text-indigo-600 text-base" />
            <p className="text-base font-medium font-garet text-gray-600 text-justify">
              1000+ happy pets
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <IoTimeOutline className="text-green-600 text-base" />
            <p className="text-base font-medium font-garet text-gray-600 text-justify">
              24/7 availability
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <IoShieldOutline className="text-cyan-600 text-base" />
            <p className="text-base font-medium font-garet text-gray-600 text-justify">
              Secure & private
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(RexVetPlanInfoCard);
