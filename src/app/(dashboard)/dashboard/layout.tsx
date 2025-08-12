import React, { PropsWithChildren } from "react";

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <h1>Dashboard header</h1>
      {children}
      <h1>Dashboard footer</h1>
    </div>
  );
};

export default DashboardLayout;
