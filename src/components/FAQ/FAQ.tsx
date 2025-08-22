"use client";
import { faqData } from "@/lib";
import React from "react";
import FaqHeader from "./FaqHeader";
import FaqSection from "./FaqSection";

const FAQ: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <FaqHeader />
      {faqData.map((section, index) => (
        <FaqSection
          key={index}
          title={section.title}
          items={section.items}
          index={index}
        />
      ))}
    </div>
  );
};

export default React.memo(FAQ);
