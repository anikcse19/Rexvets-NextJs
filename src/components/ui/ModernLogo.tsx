"use client";

import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
interface IProps {
  logoImage?: StaticImageData;
}
const ModernLogo: React.FC<IProps> = ({ logoImage }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="flex items-end ml-[10px] cursor-pointer"
    >
      <Image
        src="/images/Logo (Gradient).svg"
        alt="RexVetLogo"
        width={40}
        height={40}
        priority
      />

      <h1 className="text-3xl font-bold mb-[-7px] self-end select-none text-transparent bg-gradient-to-r from-orange-400 via-gray-200 to-teal-400 bg-[length:400%_400%] bg-clip-text animate-gradient-x drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
        exVet
      </h1>
    </div>
  );
};

export default React.memo(ModernLogo);
