import Image from "next/image";
import React from "react";

const Loader = ({ size = 45 }: { size?: number }) => {
  console.log("loading...");
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Image
        src="/logo/loaderR.webp"
        alt="Loading"
        className="animate-spin object-contain"
        width={size}
        height={size}
      />
    </div>
  );
};

export default Loader;
