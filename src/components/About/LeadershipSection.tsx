"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { School } from "lucide-react";
import { MdPsychology } from "react-icons/md";

const LeadershipSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#0a0e27] via-[#16213e] to-[#1a1a2e] overflow-hidden">
      {/* Background glow gradients */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_20%_80%,rgba(79,172,254,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(245,87,108,0.1)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-8 py-0.5 text-white text-lg font-semibold rounded-full border border-white/20 bg-white/10 backdrop-blur-lg">
            👑 Leadership
          </span>

          <h2 className="text-4xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
            Exploring Our Leadership
          </h2>

          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Meet the visionary leaders driving innovation in veterinary care
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* CEO Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500"
          >
            <div className="relative overflow-hidden">
              <Image
                src="/images/our-team/CEO.webp"
                alt="Tiffany Delacruz"
                width={600}
                height={400}
                className="w-full h-[400px] object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
              <div className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30">
                <School className="text-white w-7 h-7" />
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-1">
                Tiffany Delacruz
              </h3>
              <span className="inline-block mb-4 px-6 py-1 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-sky-400 to-indigo-500">
                Chief Executive Officer
              </span>
              <p className="text-white/85 leading-relaxed text-justify md:text-left">
                Tiffany Delacruz, the CEO of Rex Vet, is a licensed veterinarian
                with a profound dedication to preventive medicine, striving to
                enhance the well-being of pets. With extensive experience in
                veterinary practice, Tiffany possesses a comprehensive
                understanding of the concerns of pet owners and their beloved
                companions. Under her astute leadership, Rex Vet has emerged as
                a renowned entity in the veterinary realm.
              </p>
            </div>
          </motion.div>

          {/* Founder Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500"
          >
            <div className="relative overflow-hidden">
              <Image
                src="/images/our-team/Founder.webp"
                alt="Johnny Dominguez"
                width={600}
                height={400}
                className="w-full h-[400px] object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
              <div className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30">
                <MdPsychology className="text-white w-7 h-7" />
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-1">
                Johnny Dominguez
              </h3>
              <span className="inline-block mb-4 px-6 py-1 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-pink-500 to-rose-500">
                Founder
              </span>
              <p className="text-white/85 leading-relaxed text-justify md:text-left">
                Johnny Dominguez is the visionary founder behind Rex Vet. With a
                doctorate in computer science philosophy and a lifelong love for
                animals, Johnny set out to reimagine how pet families access
                care. Driven by a passion for innovation and compassion, he
                built Rex Vet to make veterinary support more accessible,
                especially for those who need it most.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating decorations */}
      <div className="absolute top-[10%] right-[5%] w-24 h-24 rounded-full bg-sky-400/10 animate-[float_8s_ease-in-out_infinite] z-10" />
      <div className="absolute bottom-[15%] left-[8%] w-20 h-20 rounded-full bg-rose-500/10 animate-[float_10s_ease-in-out_infinite_reverse] z-10" />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </section>
  );
};

export default LeadershipSection;
