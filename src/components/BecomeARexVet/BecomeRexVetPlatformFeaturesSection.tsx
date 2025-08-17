"use client";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import bg3 from "@/public/images/become-a-rex-vet/Untitled_design_8.webp";
import bg1 from "@/public/images/become-a-rex-vet/image1.webp";
import controlAvailability from "@/public/images/control-availability.svg";
import { motion, Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

type PlatformFeaturesSectionProps = {
  isVisible: boolean;
};

const BecomeRexVetPlatformFeaturesSection: React.FC<
  PlatformFeaturesSectionProps
> = ({ isVisible }) => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className=" max-w-[1200px] mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-[40px] leading-[44px] font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-4">
          Everything You Need to Practice Virtually
        </h2>
        <p className="text-[24px] text-gray-600 max-w-2xl mx-auto mt-5">
          From secure video calls to integrated scheduling, everything you need
          is built right in.
        </p>
        <div className="grid grid-cols-1 gap-6 mt-8">
          <Card className="rounded-[16px] border border-[rgba(99,102,241,0.1)] shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-[10px] bg-[linear-gradient(135deg,rgba(99,102,241,0.05),rgba(6,182,212,0.05))]">
            <CardContent className="p-6 md:p-8 items-start">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="items-start ">
                  <h3 className="text-[32px] leading-[40px]  text-start font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-7">
                    Secure Client Interaction
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Video & Chat Built for Vets",
                        description:
                          "Connect with clients securely using integrated tools designed specifically for veterinary care—no third-party apps or tech confusion.",
                      },
                      {
                        title: "Streamlined Records & Notes",
                        description:
                          "Easily document consults, upload photos, manage SOAPs, and access histories in one place.",
                      },
                      {
                        title: "Client-Friendly Messaging",
                        description:
                          "Message clients directly for updates or follow-up. Our interface keeps communication organized, private, and accessible.",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        transition={{ delay: index * 0.2 }}
                        className="flex  gap-3 items-start"
                      >
                        <Avatar className="w-6 h-6 items-center justify-center flex  bg-[#44A148]">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </Avatar>
                        <div className="items-start gap-y-4">
                          <h4 className="text-[20px] text-start -mt-1 leading-[28px]  mb-3 font-semibold">
                            {item.title}
                          </h4>
                          <p className="text-base font-normal text-start text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-2xl blur-xl" />
                  <Image
                    src={"/images/become-a-rex-vet/Untitled_design_8.webp"}
                    alt="Video consultation"
                    className="w-full h-auto rounded-2xl shadow-md relative z-10"
                    width={500}
                    height={300}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100/20 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="order-2 md:order-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/20 to-purple-200/20 rounded-2xl blur-xl" />
                  <Image
                    src={"/images/become-a-rex-vet/image1.webp"}
                    alt="Control availability"
                    className="w-full h-auto rounded-2xl shadow-md relative z-10"
                    width={500}
                    height={300}
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Control Your Availability
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Set your own schedule and consult when it works for you.",
                      "We handle the logistics—no pricing setup or client coordination needed.",
                      "Pause your availability anytime you need a break.",
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        transition={{ delay: index * 0.2 }}
                        className="flex gap-3 items-start"
                      >
                        <Avatar className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-400">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </Avatar>
                        <p className="text-sm text-gray-600">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100/20 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-orange-600 bg-clip-text text-transparent mb-4">
                    Create & Manage Medical Records
                  </h3>
                  <div className="space-y-4">
                    {[
                      "View appointment history and treatments",
                      "Add, edit, and review notes",
                      "Collaborate with pet owners to upload files, videos, and images",
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        transition={{ delay: index * 0.2 }}
                        className="flex gap-3 items-start"
                      >
                        <Avatar className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-400">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </Avatar>
                        <p className="text-sm text-gray-600">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-orange-200/20 rounded-2xl blur-xl" />
                  <Image
                    src={"/images/become-a-rex-vet/Untitled_design_8.webp"}
                    alt="Medical records"
                    className="w-full h-auto rounded-2xl shadow-md relative z-10"
                    width={500}
                    height={300}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BecomeRexVetPlatformFeaturesSection;
