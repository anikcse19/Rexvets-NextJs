import dynamic from "next/dynamic";
import React from "react";
const HowItWorks = dynamic(
  () => import("@/components/HowItWorks").then((mod) => mod.HowItWorks),
  {
    ssr: true,
  }
);
const page = () => {
  return (
    <div>
      <HowItWorks />
    </div>
  );
};

export default page;
