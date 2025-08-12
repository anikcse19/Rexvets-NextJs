import dynamic from "next/dynamic";
import React from "react";
const Donate = dynamic(
  () => import("@/components/Donate").then((mod) => mod.Donate),
  {
    loading: () => (
      <div className="">
        <p>Loading Donate page...</p>
      </div>
    ),
  }
);
const page = () => {
  return (
    <>
      <Donate />
    </>
  );
};

export default page;
