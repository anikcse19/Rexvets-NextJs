import LayoutController from "@/lib/Layoutes/ClientLayoutController";
import React from "react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <LayoutController hideOnRoutes={["video-call", "join-video-call"]}>
        {children}
      </LayoutController>
    </main>
  );
};
export default ClientLayout;
