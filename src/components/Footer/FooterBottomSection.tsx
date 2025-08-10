"use client";
import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  IoCardOutline,
  IoHeartOutline,
  IoShieldOutline,
  IoTimeOutline,
} from "react-icons/io5";

const FooterBottomSection: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-semibold">
          <IoShieldOutline className="mr-1" /> Trusted Non-Profit
        </Badge>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-semibold">
          <IoCardOutline className="mr-1" /> Top Rated 2025
        </Badge>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-semibold">
          <IoTimeOutline className="mr-1" /> 24/7 Available
        </Badge>
      </div>
      <p className="text-white/80 text-base flex items-center gap-1 flex-wrap justify-center md:justify-end text-shadow-md">
        Made with
        <IoHeartOutline className="text-yellow-400 fill-yellow-400" />
        for ©2024 Rex Vet. All rights reserved.
      </p>
    </div>
  );
};

export default React.memo(FooterBottomSection);
