"use client";
import NextImage from "next/image";
import Link from "next/link";

const VideoCallLogo: React.FC = () => {
  return (
    <div className="absolute -top-11 left-6">
      <Link href="/" aria-label="Homepage">
        <NextImage
          src="/images/Logo.svg"
          alt="Logo RexVet"
          width={120}
          height={100}
          quality={100}
        />
      </Link>
    </div>
  );
};

export default VideoCallLogo;
