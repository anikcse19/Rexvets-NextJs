"use client";
import React from "react";
import ContactForm from "./ContactForm";
import ContactHero from "./ContactHero";
import ContactInfo from "./ContactInfo";
import ContactSocial from "./ContactSocial";

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ContactHero />
      <ContactInfo />
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
            <div className="lg:col-span-5">
              <ContactSocial />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(Contact);
