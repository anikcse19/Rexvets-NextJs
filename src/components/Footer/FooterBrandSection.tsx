"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const FooterBrandSection: React.FC = () => {
  return (
    <div className="mb-8">
      <Link href="/">
        <Image
          src="/images/Logo (Gradient).svg"
          alt="Logo RexVet"
          width={120}
          height={120}
          quality={100}
        />
      </Link>
      <p className="max-w-md text-base leading-7 text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
        Building a future where no pet goes without care through accessible
        telehealth veterinary services. Connecting pet parents with licensed
        veterinarians 24/7.
      </p>
    </div>
  );
};

export default React.memo(FooterBrandSection);
