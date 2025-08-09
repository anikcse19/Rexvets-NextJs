import React, { PropsWithChildren } from "react";

const FooterSectionTitle: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <h3 className="relative mb-6 text-xl font-bold tracking-tight text-white after:absolute after:bottom-[-8px] after:left-0 after:h-[3px] after:w-10 after:rounded after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
      {children}
    </h3>
  );
};

export default React.memo(FooterSectionTitle);
