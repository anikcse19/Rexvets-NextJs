"use client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React, { FC } from "react";
import { MdVolunteerActivism } from "react-icons/md";
import { AnimatedSection } from "../shared";
import ModernButton from "../shared/ModernButton";

const DonateCauseSection: FC = () => {
  return (
    <section id="howItCause" className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <Badge className="mb-6 px-11 py-[4px] rounded-full text-base font-semibold bg-gradient-to-r from-orange-600 to-orange-400 text-white">
              💝 Make an Impact
            </Badge>

            <h2 className="text-3xl md:text-6xl mb-6 bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
              Donate to the Cause
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
              Your generous contribution helps us provide essential veterinary
              care to pets in need. Together, we can make a difference in their
              lives.
            </p>
            <div className="items-center justify-center flex flex-col">
              <Link href={"/donation"}>
                <ModernButton
                  className=" flex flex-row gap-x-4 py-5  px-12 cursor-pointer z-50 items-center justify-center"
                  variant="gradient"
                >
                  <MdVolunteerActivism className="mr-2 h-6 w-6" />
                  MAKE A DONATION
                </ModernButton>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default React.memo(DonateCauseSection);
