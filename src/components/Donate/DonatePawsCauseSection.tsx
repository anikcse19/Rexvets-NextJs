"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React, { FC } from "react";
import { MdPets } from "react-icons/md";
import { AnimatedSection } from "../shared";
import ModernButton from "../shared/ModernButton";

const DonatePawsCauseSection: FC = () => {
  return (
    <section className="py-16">
      <div className=" max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <AnimatedSection delay={200}>
              <Card className="h-full min-h-[600px] rounded-b-3xl md:rounded-l-3xl md:rounded-tr-none md:rounded-br-none shadow-xl bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6 md:p-10 h-full flex flex-col justify-center text-center md:text-right">
                  <Badge className="mb-6 px-3 rounded-full py-1 text-base font-semibold bg-gradient-to-r from-orange-600 to-orange-400 text-white self-center md:self-end">
                    🐾 Extra Love
                  </Badge>

                  <h3 className="text-2xl md:text-[48px] md:leading-[56px]  mb-6  text-[#272C89]">
                    Paws for a Cause
                  </h3>

                  <p className="text-gray-600 mb-8   md:text-start leading-[29px]">
                    Join us in extending a helping paw to animals in need! You
                    now have the opportunity to contribute even more by making
                    an additional donation to our Animal Welfare Fund. Every
                    small gesture adds up to make a big difference in the lives
                    of those who need it the most.
                  </p>
                  <Link href={"/donation"}>
                    <ModernButton className="flex flex-row items-center gap-x-2  max-w-[290px] md:mt-12 cursor-pointer z-50 py-5 ml-auto">
                      <MdPets className="mr-2 h-6 w-6" />
                      DONATE TODAY
                    </ModernButton>
                  </Link>
                  {/* <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 self-center md:self-end"
                  >
                    <Link href="/DonatePage2">
                      <MdPets className="mr-2 h-6 w-6" />
                      DONATE TODAY
                    </Link>
                  </Button> */}
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <AnimatedSection delay={400}>
              <div className="h-full min-h-[600px] rounded-t-3xl md:rounded-r-3xl md:rounded-bl-none md:rounded-tl-none overflow-hidden relative">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url(/images/donate-page/vet.webp)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 to-orange-400/30 md:rounded-bl-none md:rounded-tl-none rounded-t-3xl md:rounded-r-3xl " />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(DonatePawsCauseSection);
