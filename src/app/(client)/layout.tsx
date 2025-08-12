import dynamic from "next/dynamic";
import React from "react";
const loadingPlaceholder = () => <p>Loading...</p>;
const Header = dynamic(
  () => import("@/components/Header").then((mod) => mod.default),
  { loading: loadingPlaceholder }
);
const Footer = dynamic(
  () => import("@/components/Footer").then((mod) => mod.Footer),
  { loading: loadingPlaceholder }
);

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
};
export default ClientLayout;
