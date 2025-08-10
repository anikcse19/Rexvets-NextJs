"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaPaw } from "react-icons/fa6";
// import {
//   Facebook,
//   Instagram,
//   Favorite,
//   VolunteerActivism,
//   Pets,
//   KeyboardArrowUp,
//   LocalHospital,
//   Home,
//   Group,
//   TrendingUp,
// } from "lucide-react";
import { checkWindow } from "@/services/googleService";
import Link from "next/link";
import { FaFacebook, FaHome, FaInstagram, FaKeyboard } from "react-icons/fa";
import {
  MdFavorite,
  MdGroup,
  MdLocalHospital,
  MdPets,
  MdVolunteerActivism,
} from "react-icons/md";

// Define TypeScript interfaces
interface StatCardProps {
  icon: React.ReactNode;
  number: string;
  label: string;
  delay?: number;
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

// Animated Section Component
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay / 1000 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
};

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({
  icon,
  number,
  label,
  delay = 0,
}) => {
  return (
    <AnimatedSection delay={delay}>
      <Card className="p-6 text-center h-full bg-white/90 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02]">
        <CardContent className="flex flex-col items-center p-0">
          <Avatar className="w-20 h-20 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
            <AvatarFallback className="text-white text-2xl">
              {icon}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
            {number}
          </h3>
          <p className="text-lg font-semibold text-gray-600">{label}</p>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
};

// Scroll to Top Component
const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!checkWindow()) {
      return;
    }
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className="rounded-full bg-gradient-to-r from-blue-800 to-purple-600 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
      >
        <FaKeyboard className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};

// Main OLD_DONATE Component
const OLD_DONATE: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center py-12 md:py-0 bg-gradient-to-br from-blue-900 via-blue-950 to-blue-900 overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-orange-500/20 to-orange-300/10 blur-sm"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-[15%] left-[5%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-teal-700/20 to-teal-500/10 blur-sm"
          animate={{
            y: [0, -20, 0],
            rotate: [0, -2, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-[50%] left-[15%] w-[100px] h-[100px] rounded-full bg-gradient-to-br from-white/10 to-white/5"
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-center text-white"
          >
            <Badge className="mb-6 px-4 py-2 text-base font-semibold bg-white/15 backdrop-blur-lg border border-white/20 text-white">
              <FaPaw className="mr-2" />
              Making a Difference
            </Badge>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-shadow-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
            >
              Our Mission
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-justify text-shadow"
            >
              At Rex Vets, our mission is to increase access to veterinary care
              for all pets—regardless of their family's financial or geographic
              limitations.
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-90"
            >
              We believe that early and consistent veterinary care is essential
              for animal health and critical to strengthening the human-animal
              bond. Together, we can make a significant difference in the lives
              of pets and their families.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/DonatePage2">
                  <MdFavorite className="mr-2 h-6 w-6" />
                  OLD_DONATE Now
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-lg border border-white/30 text-white px-8 py-3 text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <a href="#howItCause">
                  <MdVolunteerActivism className="mr-2 h-6 w-6" />
                  Learn More
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<MdPets className="h-8 w-8" />}
              number="10K+"
              label="Pets Helped"
              delay={0}
            />
            <StatCard
              icon={<MdLocalHospital className="h-8 w-8" />}
              number="500+"
              label="Treatments"
              delay={200}
            />
            <StatCard
              icon={<FaHome className="h-8 w-8" />}
              number="50+"
              label="Shelters Supported"
              delay={400}
            />
            <StatCard
              icon={<MdGroup className="h-8 w-8" />}
              number="1000+"
              label="Families Helped"
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* OLD_DONATE to Cause Section */}
      <section id="howItCause" className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge className="mb-6 px-4 py-2 text-base font-semibold bg-gradient-to-r from-orange-600 to-orange-400 text-white">
                💝 Make an Impact
              </Badge>

              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
                OLD_DONATE to the Cause
              </h2>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                Your generous contribution helps us provide essential veterinary
                care to pets in need. Together, we can make a difference in
                their lives.
              </p>

              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-800 to-purple-600 text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/DonatePage2">
                  <MdVolunteerActivism className="mr-2 h-6 w-6" />
                  MAKE A DONATION
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contributions Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row min-h-[600px]">
            <div className="w-full md:w-1/2">
              <AnimatedSection delay={200}>
                <div className="h-full min-h-[600px] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url(/donatePage/vet2.webp)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-700/30 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" />
                </div>
              </AnimatedSection>
            </div>

            <div className="w-full md:w-1/2">
              <AnimatedSection delay={400}>
                <Card className="h-full min-h-[600px] rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none shadow-xl bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6 md:p-10 h-full flex flex-col justify-center">
                    <Badge className="mb-6 px-3 py-1 text-base font-semibold bg-gradient-to-r from-teal-700 to-teal-500 text-white self-start">
                      🎯 Impact
                    </Badge>

                    <h3 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
                      Contributions at Work
                    </h3>

                    <p className="text-gray-600 mb-6 text-justify leading-relaxed">
                      Your transactions with Rex Vets contribute to funding
                      impactful outreach programs. These include providing
                      support to shelters, facilitating crucial medical
                      treatments for animals in distress, and contributing to
                      community outreach initiatives.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 bg-orange-500">
                          <AvatarFallback>
                            <MdPets className="h-6 w-6 text-white" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-lg font-bold">Shelter Support</h4>
                          <p className="text-gray-600">
                            Direct aid to animal shelters
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 bg-teal-600">
                          <AvatarFallback>
                            <MdLocalHospital className="h-6 w-6 text-white" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-lg font-bold">Medical Care</h4>
                          <p className="text-gray-600">
                            Emergency treatments and surgeries
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 bg-blue-700">
                          <AvatarFallback>
                            <MdGroup className="h-6 w-6 text-white" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-lg font-bold">
                            Community Outreach
                          </h4>
                          <p className="text-gray-600">
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

      {/* Paws for a Cause Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row min-h-[600px]">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <AnimatedSection delay={200}>
                <Card className="h-full min-h-[600px] rounded-b-3xl md:rounded-l-3xl md:rounded-tr-none shadow-xl bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6 md:p-10 h-full flex flex-col justify-center text-center md:text-right">
                    <Badge className="mb-6 px-3 py-1 text-base font-semibold bg-gradient-to-r from-orange-600 to-orange-400 text-white self-center md:self-end">
                      🐾 Extra Love
                    </Badge>

                    <h3 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
                      Paws for a Cause
                    </h3>

                    <p className="text-gray-600 mb-8 text-justify md:text-right leading-relaxed">
                      Join us in extending a helping paw to animals in need! You
                      now have the opportunity to contribute even more by making
                      an additional donation to our Animal Welfare Fund. Every
                      small gesture adds up to make a big difference in the
                      lives of those who need it the most.
                    </p>

                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 self-center md:self-end"
                    >
                      <Link href="/DonatePage2">
                        <MdPets className="mr-2 h-6 w-6" />
                        DONATE TODAY
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            <div className="w-full md:w-1/2 order-1 md:order-2">
              <AnimatedSection delay={400}>
                <div className="h-full min-h-[600px] rounded-t-3xl md:rounded-r-3xl md:rounded-bl-none overflow-hidden relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url(/donatePage/vet.webp)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 to-orange-400/30 rounded-t-3xl md:rounded-r-3xl md:rounded-bl-none" />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-950 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,111,0,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_50%,rgba(0,105,92,0.1)_0%,transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <Badge className="mb-6 px-4 py-2 text-base font-semibold bg-white/15 backdrop-blur-lg border border-white/20 text-white">
                🌐 Stay Connected
              </Badge>

              <h3 className="text-3xl md:text-5xl font-bold text-white mb-8">
                Connect with Us
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              <Card
                className="p-8 text-center bg-white/95 backdrop-blur-lg border border-white/20 shadow-lg cursor-pointer min-w-[200px] hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/profile.php?id=61565972409402",
                    "_blank"
                  )
                }
              >
                <CardContent className="p-0">
                  <Avatar className="w-20 h-20 mx-auto mb-4 bg-[#1877f2] shadow-lg hover:bg-[#166fe5] hover:scale-110 transition-all duration-300">
                    <AvatarFallback>
                      <FaFacebook className="h-10 w-10 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="text-xl font-bold mb-1">Facebook</h4>
                  <p className="text-gray-600">Follow our updates</p>
                </CardContent>
              </Card>

              <Card
                className="p-8 text-center bg-white/95 backdrop-blur-lg border border-white/20 shadow-lg cursor-pointer min-w-[200px] hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                onClick={() =>
                  window.open("https://www.instagram.com/rexvets/", "_blank")
                }
              >
                <CardContent className="p-0">
                  <Avatar className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 shadow-lg hover:scale-110 transition-all duration-300">
                    <AvatarFallback>
                      <FaInstagram className="h-10 w-10 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="text-xl font-bold mb-1">Instagram</h4>
                  <p className="text-gray-600">See our stories</p>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* <Footer /> */}
      <ScrollToTop />
    </div>
  );
};

export default OLD_DONATE;
