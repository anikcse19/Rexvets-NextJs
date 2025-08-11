/* eslint-disable @next/next/no-img-element */
"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React, { FC } from "react";
import { MdGroup, MdLocalHospital, MdPets } from "react-icons/md";
import { AnimatedSection } from "../shared";

const DonateContributionsSection: FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 lg:min-h-[600px]">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex">
            <AnimatedSection delay={200}>
              <div className="relative h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[600px] rounded-t-2xl lg:rounded-l-3xl lg:rounded-tr-none overflow-hidden flex-1">
                <img
                  src={"/images/donate-page/vet2.webp"}
                  alt="Donate Section Vet"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 flex">
            <AnimatedSection delay={400}>
              <Card className="h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[600px] md:rounded-tl-none md:rounded-bl-none shadow-xl bg-gradient-to-br from-white to-gray-50 flex-1">
                <CardContent className="p-5 sm:p-8 lg:p-10 h-full flex flex-col justify-center">
                  <Badge className="mb-5 sm:mb-6 px-3 py-1 text-sm sm:text-base font-semibold bg-gradient-to-r from-teal-700 to-teal-500 text-white self-start">
                    🎯 Impact
                  </Badge>

                  <h3 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
                    Contributions at Work
                  </h3>

                  <p className="text-gray-600 mb-6 text-sm sm:text-base text-justify leading-relaxed">
                    Your transactions with Rex Vets contribute to funding
                    impactful outreach programs. These include providing support
                    to shelters, facilitating crucial medical treatments for
                    animals in distress, and contributing to community outreach
                    initiatives.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarFallback className="bg-[#9C27B0] flex items-center justify-center">
                          <MdPets className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold">
                          Shelter Support
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Direct aid to animal shelters
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarFallback className="bg-[#BDBDBD] flex items-center justify-center">
                          <MdLocalHospital className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold">
                          Medical Care
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Emergency treatments and surgeries
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarFallback className="bg-[#1976D2] flex items-center justify-center">
                          <MdGroup className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold">
                          Community Outreach
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Education and awareness programs
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(DonateContributionsSection);
