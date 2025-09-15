import React from "react";

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-[#1BC5A3] hover:scale-110 transition-transform duration-300 p-3 rounded-full cursor-pointer shadow-md">
    {children}
  </div>
);
export default React.memo(IconWrapper);
