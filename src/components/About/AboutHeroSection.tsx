"use client";
import { motion } from "framer-motion";
import { FaPaw } from "react-icons/fa";


const AboutHeroSection = () => {
    return (
        <section
            className="relative flex items-center min-h-screen bg-fixed bg-cover bg-bottom"
            style={{
                backgroundImage: `
          linear-gradient(135deg, rgba(0, 34, 97, 0.85) 0%, rgba(8, 73, 193, 0.85) 100%),
          url('/images/about/AboutUsCover.webp')
        `,
            }}
        >
            {/* Radial Glow Overlay */}
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>

            {/* Content */}
            <div className="relative z-15 container mx-auto px-6 text-center">
                {/* Chip */}
                <div className="inline-flex items-center gap-2 mb-6 px-10 py-0.5 rounded-full text-white font-semibold border border-white/20 backdrop-blur-xl bg-white/15">
                    <FaPaw className="text-white" />
                    <span className="text-lg">About Rex Vets</span>
                </div>

                {/* Heading 1 */}
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold leading-tight mb-2 bg-gradient-to-r from-white via-[#e3f2fd] to-[#e3f2fd] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                    Bringing Joy to
                </h1>

                {/* Heading 2 */}
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
                    Every Paw & Heart
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-2xl f text-white/90 max-w-2xl mx-auto leading-relaxed">
                    Transforming veterinary care through innovation, compassion, and accessibility
                </p>
            </div>

            {/* Floating Decorative Elements with Framer Motion */}
            <motion.div
                className="absolute top-[15%] right-[10%] w-20 h-20 rounded-full opacity-60"
                style={{
                    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                }}
                animate={{
                    y: [0, -30, 0],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-[20%] left-[8%] w-16 h-16 rounded-full opacity-50"
                style={{
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                }}
                animate={{
                    y: [0, -30, 0],
                    rotate: [0, -180, -360],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </section>
    );
};

export default AboutHeroSection;