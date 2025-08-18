import React from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

const FinancialTransparency = () => {
  return (
    <>
      {/* Hero Section */}
      <div
        className="relative min-h-screen flex items-center bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(30,41,59,0.9), rgba(51,65,85,0.9), rgba(71,85,105,0.9)), url('/images/legal-support/ourmissionbg.webp')`,
        }}
      >
        {/* Overlay effects */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08)_0%,transparent_50%),radial-gradient(circle_at_40%_60%,rgba(71,85,105,0.1)_0%,transparent_50%)]" />

        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white tracking-tight drop-shadow-xl">
            Your Donations at Work
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90 leading-relaxed drop-shadow-lg">
            At Rex Vets, transparency is key to building trust with our
            community. We want you to know exactly how your donations are being
            used to support pets in need through telehealth services.
          </p>

          <Link
            href="/DonatePage2"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-lg transition-transform transform hover:-translate-y-1 shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Heart className="w-6 h-6" /> Donate Now
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Veterinary Care",
              percentage: "70%",
              description:
                "of funds are allocated to providing telehealth veterinary care, including subsidized virtual consultations, emergency telehealth services, and follow-up care.",
            },
            {
              title: "Programs",
              percentage: "20%",
              description:
                "of funds support community outreach programs, such as online pet owner education, virtual wellness clinics, and partnerships with local shelters.",
            },
            {
              title: "Administrative Costs",
              percentage: "10%",
              description:
                "of funds cover administrative costs, ensuring that our team can continue to offer high-quality, accessible telehealth care.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded-2xl p-6 shadow-md transition-transform hover:-translate-y-2"
            >
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-3xl font-extrabold text-indigo-700 mb-2">
                {item.percentage}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Final CTA Section */}
        <div className="text-center mt-12 max-w-2xl mx-auto px-4">
          <p className="text-lg md:text-xl mb-6">
            Together, we can create a world where no pet is left without care
            due to distance or financial hardship. Thank you for your trust and
            support.
          </p>
          <Link
            href="/DonatePage2"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-lg transition-transform transform hover:-translate-y-1 shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Heart className="w-6 h-6" /> Donate Now
          </Link>
        </div>
      </div>
    </>
  );
};

export default FinancialTransparency;
