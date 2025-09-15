import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";

const PetParentSupportSection = () => {
  const supportItems = [
    {
      amount: "$20",
      description: "Provides a telehealth consultation for a pet in need.",
    },
    {
      amount: "$30",
      description: "Supports a follow-up consultation for ongoing care.",
    },
    {
      amount: "$50",
      description:
        "Funds a comprehensive care plan for a pet with chronic health issues.",
    },
    {
      amount: "$100+",
      description:
        "Expands our ability to offer specialized care and reach more pets.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 text-white py-20 md:py-32">
      <div className="relative  mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="w-full">
            <img
              src="/images/pet-parents/dogimage.webp"
              alt="Support Pets"
              className="w-full h-auto rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            />
          </div>

          {/* Text & support items */}
          <div className=" space-y-14">
            <h2 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
              <span className="bg-gradient-to-br from-emerald-500 to-emerald-700 bg-clip-text text-transparent font-semibold drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]">
                Your Support
              </span>{" "}
              Makes a Difference
            </h2>

            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              Every dollar you contribute goes directly toward providing
              affordable telehealth services to pets who need them most. Here's
              how your support helps:
            </p>

            <ul className=" space-y-8">
              {supportItems.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  {/* Amount circle */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-xs flex-shrink-0">
                    $
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-white font-semibold">{item.amount}</p>
                    <p className="text-white/80">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Donate button */}
            <Link
              href="/donate-now"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base text-slate-900 bg-gradient-to-r from-[#f8bd55] to-[#f6a10d] hover:from-[#f6a10d] hover:to-[#f7a00a] hover:text-white transition-transform duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-lg shadow-[#c0ab77] hover:shadow-[#f2ce71]"
            >
              <Heart size={20} />
              Make a Donation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetParentSupportSection;
