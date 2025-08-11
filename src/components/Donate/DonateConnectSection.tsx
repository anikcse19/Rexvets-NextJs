"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React, { FC } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { AnimatedSection } from "../shared";

const DonateConnectSection: FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-950 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,111,0,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_50%,rgba(0,105,92,0.1)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12">
            <Badge className="mb-6 px-4 py-2  rounded-full text-base font-semibold bg-white/15 backdrop-blur-lg border border-white/20 text-white">
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
                <Avatar className="w-20 h-20 mx-auto mb-4 shadow-lg hover:scale-110 transition-all duration-300">
                  <AvatarFallback className="bg-[#1877f2] flex items-center justify-center hover:bg-[#166fe5] transition-colors duration-300">
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
                <Avatar className="w-20 h-20 mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300">
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 flex items-center justify-center">
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
  );
};

export default React.memo(DonateConnectSection);
