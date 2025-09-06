"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
interface IProps {
  description: string;
  isShowVisitPerfumery: boolean;
}
const ReadyToGetStarted: React.FC<IProps> = ({
  description,
  isShowVisitPerfumery,
}) => {
  return (
    <section className="bg-[#1E293B] text-white py-8 md:py-36">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-extrabold mb-3"
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg mb-6 opacity-90 my-9"
        >
          {description}
        </motion.p>
        <div className="flex flex-col  md:flex-row items-center justify-center gap-x-7">
          <div className="items-center justify-center flex mt-11">
            <Link href={"/find-a-vet"} passHref>
              <button className="group bg-white text-gray-900 rounded-full cursor-pointer flex items-center justify-center px-11 py-4 text-lg font-bold shadow-lg hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-300">
                Find a Vet
                <Star
                  size={20}
                  className="ml-2 text-gray-900 transition-colors duration-300 group-hover:text-yellow-400"
                />
              </button>
            </Link>
          </div>
          {isShowVisitPerfumery && (
            <div className="items-center justify-between flex mt-11">
              <div
                onClick={() =>
                  window.open(
                    "https://rexvets.securevetsource.com/site/view/230921_Home.pml",
                    "__blank"
                  )
                }
              >
                <button className=" bg-transparent border border-white  rounded-full cursor-pointer flex items-center justify-center px-11 py-4 text-lg font-bold shadow-lg text-white hover:opacity-40 hover:-translate-y-0.5 transition-all duration-300">
                  Visit Pharmacy
                  <FaArrowRightLong
                    size={20}
                    className="ml-2 text-gray-100  "
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default React.memo(ReadyToGetStarted);
