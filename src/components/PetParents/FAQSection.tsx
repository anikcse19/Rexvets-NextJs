"use client"
import { Expand } from "lucide-react";
import { useState } from "react";



interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: "What is Rex Vets?",
        answer:
            "Rex Vets is committed to providing affordable online veterinary services to ensure that pet health reaches remote areas and underserved communities. We operate solely through donations, allowing us to make a positive impact on pets and their owners who may otherwise have limited access to veterinary care.",
    },
    {
        question:
            "What types of medical conditions can Rex Vets assist with through telemedicine?",
        answer:
            "Rex Vets can provide advice on a wide range of non-emergency medical conditions, including skin problems, digestive issues, behavioral concerns, and general wellness. You can access this information on our What We Treat page. However, in cases of emergencies or when physical examinations are required, we recommend seeking in-person veterinary care.",
    },
    {
        question: "How secure is my pet's medical information when using Rex Vets?",
        answer:
            "We take the privacy and security of your pet's medical information seriously. All consultations and records are encrypted and stored following strict confidentiality standards to ensure that your data is fully protected.",
    },
];

const features: string[] = ["24/7 Available", "Licensed Vets", "Affordable Care", "Secure Platform"];

const FAQSection=()=> {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-20 md:py-28">
            {/* Radial background effects */}

            <div className="relative  mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Text */}
                <div className="lg:col-span-5">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-md">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-white/90 mb-6 text-lg md:text-xl leading-relaxed">
                        Choose Rex Vets and give your pets the expert care they deserve,
                        anytime, anywhere. Join us and experience stress-free pet
                        parenting today!
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {features.map((feature, idx) => (
                            <span
                                key={idx}
                                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold px-3 py-1 rounded-full text-sm"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>

                {/* FAQ Accordion */}
                <div className="lg:col-span-7 space-y-4">
                    {faqItems.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white/10 border border-white/15 rounded-xl overflow-hidden transition-all shadow-lg"
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex justify-between items-center px-6 py-4 font-semibold text-left text-white text-base md:text-lg transition-colors"
                            >
                                {faq.question}
                                <Expand
                                    className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                           
                            {/* Accordion Body */}
                            <div
                                className={`px-6 pb-4 text-white/90 text-sm md:text-base overflow-hidden transition-all max-h-96 duration-300 ${openIndex === index ? "flex" : "hidden"
                                    }`}
                            >
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default FAQSection;