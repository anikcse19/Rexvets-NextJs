"use client";
import React from "react";
import {
  Heart,
  Users,
  Handshake,
  ArrowRight,
  Star,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const SupportUs = () => {
  const navigate = useRouter();

  const supportOptions = [
    {
      icon: Heart,
      title: "Donate",
      description:
        "Your contribution directly funds our telehealth services, making virtual veterinary care accessible to all.",
      buttonText: "Donate Now",
      action: () => navigate.push("/DonatePage1"),
      color: "bg-red-500",
      variant: "from-blue-500 to-purple-500",
    },
    {
      icon: Users,
      title: "Volunteer",
      description:
        "Help us spread the word about our telehealth services and support our virtual events and outreach programs.",
      buttonText: "Volunteer Opportunities",
      action: () => navigate.push("/Contact"),
      color: "bg-emerald-500",
      variant: "from-emerald-500 to-emerald-700",
    },
    {
      icon: Handshake,
      title: "Partner with Us",
      description:
        "Are you an organization or business committed to making a difference? Partner with Rex Vet to help us expand our telehealth reach.",
      buttonText: "Learn More",
      action: () => navigate.push("/Contact"),
      color: "bg-amber-500",
      variant: "from-amber-500 to-amber-700",
    },
  ];

  const stats = [
    { number: "1,000+", label: "Pets Helped", icon: Heart },
    { number: "24/7", label: "Availability", icon: Shield },
    { number: "50+", label: "Licensed Vets", icon: Star },
    { number: "95%", label: "Satisfaction Rate", icon: CheckCircle },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-fixed bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(59,130,246,0.9), rgba(139,92,246,0.9), rgba(6,182,212,0.9)), url('/images/legal-support/support.webp')",
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto text-center px-6 py-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
            Support{" "}
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-md">
              Rex Vet
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
            As a non-profit organization, Rex Vet depends on the kindness and
            generosity of our community to expand our telehealth services. There
            are several ways you can support our mission.
          </p>
          <p className="mt-4 text-xl font-semibold text-amber-400 drop-shadow">
            Every act of support helps us provide critical care, no matter where
            pets and their families are located
          </p>
        </div>
      </section>

      {/* Support Options Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {supportOptions.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg p-8 flex flex-col justify-center items-center hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300"
            >
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${option.color}`}
              >
                <IconComponent size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {option.title}
              </h3>
              <p className="text-slate-600 flex-1 mb-6 leading-relaxed">
                {option.description}
              </p>
              <button
                onClick={option.action}
                className={`w-full py-4 px-6 rounded-full cursor-pointer text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r ${option.variant} shadow-md hover:shadow-xl hover:-translate-y-1 transition`}
              >
                {option.buttonText}
                <ArrowRight size={20} />
              </button>
            </div>
          );
        })}
      </section>

      {/* Stats Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow">
            Our{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent drop-shadow-md">
              Impact
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-lg text-white/90 mb-12">
            See how your support is making a difference in the lives of pets and
            their families
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:-translate-y-2 transition shadow-lg flex flex-col justify-center items-center"
                >
                  <IconComponent size={40} className="text-emerald-500 mb-4" />
                  <h3 className="text-3xl font-extrabold">{stat.number}</h3>
                  <p className="text-white/80 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Join our mission to provide accessible veterinary care to pets
            everywhere. Every contribution, big or small, helps save lives.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate.push("/donate-now")}
              className="py-4 px-8 rounded-full text-white font-semibold cursor-pointer flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
            >
              Donate now <Heart size={20} />
            </button>
            <button
              onClick={() => navigate.push("/contact")}
              className="py-4 px-8 rounded-full cursor-pointer text-white font-semibold flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
            >
              Get Involved <Users size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportUs;
