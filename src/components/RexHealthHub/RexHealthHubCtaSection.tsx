"use client";
import React from "react";
import { IRexHealthHubCtaSectionProps } from "./interface";

const RexHealthHubCtaSection: React.FC<IRexHealthHubCtaSectionProps> = ({
  title,
  description,
  tags,
}) => {
  return (
    <section className="text-center py-12  overflow-x-hidden min-h-fit box-border">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 z-10">
        {title}
      </h2>

      <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto mb-4 z-10">
        {description}
      </p>

      <div className="flex justify-center gap-2 flex-wrap">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-colors z-10"
          >
            {tag}
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(RexHealthHubCtaSection);
