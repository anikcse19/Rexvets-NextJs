"use client";
import { Heart, Shield, Award, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const cards = [
    {
        title: "Friend of Rex Vets",
        description:
            "Join as a Friend of Rex Vets and help us provide Affordable telehealth consultations to pets in need. Your monthly contribution ensures ongoing care for pets who otherwise might not receive it.",
        contribution: "Choose from $20, $25, $50, or customize your amount.",
        benefits: [
            "Regular updates on our impact",
            "Recognition as a supporter",
            "Access to exclusive online events",
        ],
        button: "Become a Friend",
        icon: Heart,
        color: "#ef4444",
    },
    {
        title: "Community Champion",
        description:
            "Become a Community Champion by making a larger impact. Your support helps fund critical care for pets in underserved communities, ensuring that every pet has access to the help they need.",
        contribution: "$100, $250, $500, or customize your amount.",
        benefits: [
            "All Friend-level benefits",
            "Personalized impact stories",
            "Special recognition on our website",
        ],
        button: "Join as a Champion",
        icon: Award,
        color: "#fbbf24",
        recommended: true,
    },
    {
        title: "Pet Care Hero",
        description:
            "As a Pet Care Hero, your generous support enables us to provide comprehensive care services and expand our reach to more pets in need. Help us change lives, one pet at a time.",
        contribution: "$1,000 or more.",
        benefits: [
            "All previous benefits",
            "Exclusive invitations to virtual events with our veterinarians",
            "Feature stories in our newsletters",
        ],
        button: "Be a Hero",
        icon: Shield,
        color: "#8b5cf6",
    },
];

const PetParentMembershipCards = () => {
    return (
        <section className="py-16 container mx-auto px-6">
            <h2 className="text-3xl md:text-6xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-green-500 to-emerald-700 font-semibold bg-clip-text text-transparent">
                    Affordable
                </span>{" "}
                Pet Care You Can Rely On
            </h2>
            <div className="w-20 h-1 mb-12 rounded-lg mx-auto mt-4 bg-gradient-to-r from-emerald-500 to-emerald-700"></div>

            <div className="grid md:grid-cols-3 gap-8">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={i}
                            className={`relative rounded-2xl shadow-lg p-8 bg-white hover:scale-105 overflow-hidden transition ${card.recommended ? "border-3 border-[#f8bd55]" : "border"
                                }`}
                        >
                            {/* recoimended section */}
                            {card.recommended && (
                                <span className="absolute top-5 right-[-30px] overflow-hidden rotate-45 bg-gradient-to-r from-[#f8bd55] to-[#f6a10d] text-white text-xs px-10 py-2 font-medium">
                                    RECOMMENDED
                                </span>
                            )}
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-14 h-14 flex items-center justify-center rounded-xl`}
                                    style={{ backgroundColor: `${card.color}1A` }}>
                                    <Icon color={card.color}  size={28} />
                                </div>
                                <h3 className="text-xl font-bold">{card.title}</h3>
                            </div>
                            <p className="text-slate-500 font-normal mb-5 leading-[1.6]">{card.description}</p>
                            <p className="font-bold mb-2">Suggested Contribution:<br></br>  </p>
                            <span className="text-slate-500 font-normal mb-4 leading-[1.6]">{card.contribution}</span>
                            <p className="font-bold mt-5 mb-2">Benefits:</p>
                            <ul className="space-y-2 my-6">
                                {card.benefits.map((b, j) => (
                                    <li key={j} className="flex items-center text-[14px] gap-2 text-slate-500 font-normal mb-4 leading-[1.6]">
                                        <CheckCircle className="text-green-500 w-4 h-4" /> {b}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/donate"
                                className={`w-full inline-flex justify-center mt-5 items-center py-4 rounded-full font-bold shadow-xl 
                  ${card.recommended ? "bg-gradient-to-r from-[#f8bd55] to-[#f6a10d] text-black shadow-[#fff3d5] hover:shadow-[#fcecc3]" : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[#e1ecfe] hover:shadow-[#c8d9f5] "} hover:scale-105 transition`}
                            >
                                {card.button} <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default PetParentMembershipCards;