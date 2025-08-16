import dynamic from "next/dynamic";
import React from "react";
const Home = dynamic(
  () => import("@/components/Home").then((mod) => mod.Home),
  {
    loading: () => (
      <div className="">
        <p>Loading Home page...</p>
      </div>
    ),
  }
);
const page = () => {
  return (
    <>
      <Home />
    </>
  );
};

export default page;
