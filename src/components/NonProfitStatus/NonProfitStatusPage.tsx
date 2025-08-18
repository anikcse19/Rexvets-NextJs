import Link from 'next/link';
import React from 'react';

const NonProfitStatusPage = () => {
    return (
        <>
            <div className="bg-[#002261] page-nonprofit">
                <div className="container mx-auto py-16 px-6 lg:py-24 lg:px-0 relative">
                    {/* Background image */}
                    <div
                        className="absolute top-0 right-0 h-full w-full bg-no-repeat bg-top-right opacity-10 lg:opacity-100"
                        style={{
                            backgroundImage:
                                "url('/images/NonProfitStatus/nonprofitimage.webp')",
                            backgroundSize: "contain",
                        }}
                    ></div>

                    <div className="relative z-10">
                        <div className="lg:w-1/2">
                            <h2 className="text-white text-4xl lg:text-5xl font-bold mb-8 lg:mb-10">
                                Our Non-Profit Commitment
                            </h2>
                            <p className="text-white text-lg lg:text-xl mb-6">
                                At Rex Vets, we’re dedicated to expanding access to veterinary
                                care through compassionate, affordable telehealth services. As a
                                nonprofit organization, our mission is to increase access to
                                veterinary care for all pets—regardless of their family’s
                                financial or geographic limitations. Too often, animals end up
                                in shelters or suffer from preventable, late stage medical
                                conditions simply because timely care wasn’t available.
                            </p>
                        </div>

                        <p className="text-white text-lg lg:text-xl lg:w-2/3">
                            We rely on the generosity of supporters like you to make this
                            possible. Your donations directly fund our telehealth programs,
                            helping us provide low-cost consultations, emergency guidance, and
                            reliable veterinary support—all from the comfort of home.
                            Together, we’re making a difference—one virtual visit at a time.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-[#00021d] text-white text-center py-10 px-6 lg:py-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Join us in making a difference.
                </h2>
                <p className="mb-6 text-lg lg:text-xl">
                    Learn more about how you can support Rex Vets or <br /> make a
                    donation today to help expand our telehealth
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/Donate"
                        className="bg-green-600 hover:bg-[#000f1f] text-white font-semibold rounded-full px-8 py-3 text-lg transition-all duration-300"
                    >
                        Learn More
                    </Link>
                    <Link
                        href="/DonatePage1"
                        className="bg-green-600 hover:bg-[#000f1f] text-white font-semibold rounded-full px-8 py-3 text-lg transition-all duration-300"
                    >
                        Donate Now
                    </Link>
                </div>
            </div>
            </>
    );
};

export default NonProfitStatusPage;