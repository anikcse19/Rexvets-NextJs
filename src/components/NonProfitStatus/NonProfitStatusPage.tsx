import React from "react";
import { Heart, Users } from "lucide-react";
import Link from "next/link";

const NonProfitPage = () => {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.9) 50%, rgba(71, 85, 105, 0.9) 100%), url('/images/legal-support/support.webp')",
        }}
      >
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
              Non-Profit
            </span>{" "}
            Commitment
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/90 leading-relaxed drop-shadow">
            At Rex Vets, we’re dedicated to expanding access to veterinary care
            through compassionate, affordable telehealth services. Our mission
            is to increase access to veterinary care for all pets—regardless of
            their family’s financial or geographic limitations.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-400">
            Why We Do It
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Too often, animals end up in shelters or suffer from preventable,
            late-stage medical conditions simply because timely care wasn’t
            available. We rely on the generosity of supporters like you to make
            this possible.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Your donations directly fund our telehealth programs, helping us
            provide low-cost consultations, emergency guidance, and reliable
            veterinary support—all from the comfort of home. Together, we’re
            making a difference—one virtual visit at a time.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <img
            src="/images/legal-support/nonprofitimage.webp"
            alt="Non-Profit Support"
            className="rounded-3xl shadow-2xl max-w-full h-auto"
          />
        </div>
      </section>

      {/* Impact Cards Section */}
      <section className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Your Support in Action
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            See how contributions from our community make a real difference in
            the lives of pets and their families.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition transform">
            <Heart size={32} className="text-red-500 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">1,000+ Pets Helped</h3>
            <p className="text-gray-300">
              Providing care to thousands of pets through virtual consultations.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition transform">
            <Users size={32} className="text-emerald-500 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">50+ Volunteers</h3>
            <p className="text-gray-300">
              Helping us spread awareness and provide support where it's needed
              most.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition transform">
            <Heart size={32} className="text-amber-500 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Millions in Donations</h3>
            <p className="text-gray-300">
              Funding telehealth services that bring veterinary care to every
              pet.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Join Us in Making a Difference
        </h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">
          Learn more about how you can support Rex Vets or make a donation today
          to help expand our telehealth programs.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/Donate"
            className="px-8 py-4 rounded-full font-semibold bg-white text-blue-600 hover:bg-gray-100 transition"
          >
            Learn More
          </Link>
          <Link
            href="/DonatePage1"
            className="px-8 py-4 rounded-full font-semibold bg-amber-400 text-white hover:bg-amber-500 transition flex items-center gap-2"
          >
            Donate Now <Heart size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NonProfitPage;
