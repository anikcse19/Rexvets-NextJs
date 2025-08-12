import { motion, Variants } from "framer-motion";
import Image from "next/image";
import React from "react";
import { FaShieldAlt, FaShoppingCart } from "react-icons/fa";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};
interface IProps {
  title: string;
  sub_title: string;
  description: string;
}
const GetAPrescriptionPharmacySection: React.FC<IProps> = ({
  title = "",
  sub_title = "",
  description = "",
}) => (
  <motion.section
    className="py-8 md:py-24 bg-gradient-to-br from-slate-50 to-white relative"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={staggerContainer}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(59,130,246,0.05)_0%,_transparent_50%),radial-gradient(circle_at_80%_70%,_rgba(139,92,246,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div variants={fadeInUp}>
          <h2 className="  font-extrabold  mb-4">
            <span className="text-3xl md:text-[56px] md:leading-[67px] text-slate-900">
              {title}{" "}
            </span>
            <span className=" text-3xl md:text-[56px] font-normal bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {sub_title}
            </span>
          </h2>
          <p className="text-lg text-slate-600 mb-4 md:text-[20px] md:leading-[34px]">
            {description}
          </p>
          <div className="flex items-center gap-2 my-5">
            <FaShieldAlt className="text-emerald-500" />
            <p className="text-slate-600 font-medium md:text-base ">
              Veterinarian-approved products only
            </p>
          </div>
          <motion.button
            className=" cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold mt-3 py-4 px-8 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 ease-out"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() =>
              (window.location.href =
                "https://rexvets.securevetsource.com/site/view/230921_Home.pml")
            }
          >
            <span className="flex items-center justify-between">
              Visit Pharmacy <FaShoppingCart className="ml-2" />
            </span>
          </motion.button>
        </motion.div>
        <motion.div variants={fadeInUp} className="flex justify-end ">
          <Image
            src="/images/get-a-prescription/imgShop2.webp"
            alt="Pet Products"
            width={720}
            height={720}
            className="rounded-3xl shadow-2xl"
          />
        </motion.div>
      </div>
    </div>
  </motion.section>
);

export default React.memo(GetAPrescriptionPharmacySection);
