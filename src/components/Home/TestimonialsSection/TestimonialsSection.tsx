"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITestimonial } from "@/lib";
import { getFilteredReviews } from "@/services/googleService";
import { motion, Variants } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import TestimonialsSectionCard from "./TestimonialsSectionCard";
import TestimonialsSectionHeader from "./TestimonialsSectionHeader";

const mockGoogleReviews = [
  {
    name: "Amr Taha",
    text: "I've used other online vet services but Rex Vet is by far the best. Their vet was super compassionate and took time to listen. I loved that they weren't trying to upsell me or rush things. My cat had a minor cold and after the advice we got from Rex Vet, he's doing much better. Highly recommend!",
    image:
      "https://ui-avatars.com/api/?name=Amr+Taha&background=4285f4&color=fff&size=150",
    date: "4 days ago",
    rating: 5,
    source: "google",
  },
  {
    name: "Maria Santos",
    text: "Outstanding telehealth service! The vet was incredibly thorough and helped me understand my dog's allergies. The online prescription service saved me so much time. Rex Vet really cares about pets and their families.",
    image:
      "https://ui-avatars.com/api/?name=Maria+Santos&background=34a853&color=fff&size=150",
    date: "1 week ago",
    rating: 5,
    source: "google",
  },
  {
    name: "Dr. Michael Chen",
    text: "As a physician myself, I appreciate the professionalism and expertise of Rex Vet. They provided excellent guidance for my senior cat's health issues. The convenience of telehealth for pets is a game-changer.",
    image:
      "https://ui-avatars.com/api/?name=Michael+Chen&background=ea4335&color=fff&size=150",
    date: "2 weeks ago",
    rating: 5,
    source: "google",
  },
  {
    name: "Jennifer Walsh",
    text: "Great experience with Rex Vet! The vet was patient with my anxious dog and gave practical advice that actually worked. The affordable pricing makes quality vet care accessible to everyone.",
    image:
      "https://ui-avatars.com/api/?name=Jennifer+Walsh&background=fbbc04&color=fff&size=150",
    date: "3 weeks ago",
    rating: 4,
    source: "google",
  },
];

const testimonials = [
  {
    name: "Joaquin Paiva",
    text: "Fantastic online vet service! Easy to use, and the vet was very knowledgeable and caring.",
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    date: "June 2024",
    rating: 5,
    source: "curated",
  },
  {
    name: "Mario Bratford",
    text: "Good service with fast scheduling. The consultation felt a bit rushed, though.",
    image:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    date: "May 2024",
    rating: 4,
    source: "curated",
  },
  {
    name: "Luciana Aguilar",
    text: "Great online vet experience. The consultation was quick, and the vet was attentive. Highly recommend!",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    date: "April 2024",
    rating: 5,
    source: "curated",
  },
  {
    name: "Martin Espinoza",
    text: "Top-notch veterinary guidance online, easy booking and fast medication delivery.",
    image:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    date: "March 2024",
    rating: 5,
    source: "curated",
  },
  {
    name: "Lucas Sanabria",
    text: "Efficient and caring virtual vet consultations at a reasonable price.",
    image:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    date: "July 2024",
    rating: 5,
    source: "curated",
  },
  {
    name: "Laura Gomensoro",
    text: "Top-notch veterinary guidance online, easy booking and fast medication delivery.",
    image:
      "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    date: "April 2024",
    rating: 5,
    source: "curated",
  },
];
// https://github.com/jdrexxxx/Rexvets-nextjs.git (fetch)
const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [allTestimonials, setAllTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Responsive card count
  const getCardsPerView = () => {
    if (typeof window === "undefined") return 1; // Default to 1 for SSR to match mobile
    const width = window.innerWidth;
    if (width < 768) return 1; // Mobile
    if (width < 1024) return 2; // Tablet
    return 3; // Desktop
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());

  // Update cardsPerView on window resize
  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Shuffle array
  const shuffleArray = useCallback((array: ITestimonial[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Mix Google and curated testimonials
  const mixTestimonials = useCallback(
    (googleReviews: ITestimonial[], curatedTestimonials: ITestimonial[]) => {
      if (googleReviews.length > 0) {
        const maxGoogleReviews = 10;
        const maxCuratedReviews = 0;
        const selectedGoogleReviews = googleReviews.slice(0, maxGoogleReviews);
        const selectedCuratedReviews = curatedTestimonials.slice(
          0,
          maxCuratedReviews
        );
        const mixed = [...selectedGoogleReviews, ...selectedCuratedReviews];
        console.log(
          `✅ Testimonials loaded: ${mixed.length} total (${selectedGoogleReviews.length} Google + ${selectedCuratedReviews.length} curated)`
        );
        return shuffleArray(mixed);
      }
      console.log("⚠️ No Google reviews, using curated only");
      return curatedTestimonials;
    },
    [shuffleArray]
  );

  // Load testimonials
  useEffect(() => {
    const loadTestimonials = async () => {
      setLoading(true);
      setError(null);
      try {
        let googleReviews: any[] = [];
        console.log("🚀 Fetching REAL Google reviews...");
        try {
          googleReviews = await getFilteredReviews(4);
          console.log(
            `🎉 Loaded ${googleReviews.length} Google reviews:`,
            googleReviews
          );
        } catch (googleError: any) {
          console.error(
            "⚠️ Google Places API failed, using fallback:",
            googleError.message
          );
          googleReviews = mockGoogleReviews as any;
          console.log(`📦 Using ${googleReviews.length} mock reviews`);
        }
        const mixedTestimonials = mixTestimonials(
          googleReviews,
          testimonials as any
        );
        setAllTestimonials(mixedTestimonials);
      } catch (error) {
        console.error("❌ Error loading testimonials:", error);
        setError("Failed to load testimonials");
        setAllTestimonials(testimonials as any);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, [mixTestimonials]);

  // Auto-slide
  useEffect(() => {
    if (!isAutoPlaying || allTestimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, allTestimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getVisibleTestimonials = () => {
    if (allTestimonials.length === 0) return [];
    const visible = [];
    for (let i = 0; i < cardsPerView; i++) {
      const index = (currentIndex + i) % allTestimonials.length;
      visible.push({ ...allTestimonials[index], index });
    }
    return visible;
  };

  // Framer Motion variants for navigation buttons
  const buttonVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  // Framer Motion variants for pagination dots
  const dotVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Decorative Elements */}
      <div className="absolute top-[10%] left-[5%] w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 animate-bounce" />
      <div className="absolute bottom-[15%] right-[8%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-red-500 opacity-10 animate-bounce [animation-delay:1s]" />

      <div className="3xl:max-w-screen-3xl py-8 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <TestimonialsSectionHeader
          title="Testimonials"
          description="Discover why thousands of pet owners trust our veterinary expertise for their beloved companions"
          sub_title="What Our Pet Parents Say"
        />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px] mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-6 p-4 bg-yellow-100/80 text-yellow-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && allTestimonials.length > 0 && (
          <div className="mb-6">
            <div
              className={`grid gap-4 mb-6 ${
                cardsPerView === 1
                  ? "grid-cols-1"
                  : cardsPerView === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {getVisibleTestimonials().map((testimonial, idx) => (
                <div key={`${testimonial.index}-${idx}`} className="w-full">
                  <TestimonialsSectionCard
                    testimonial={testimonial}
                    isMiddle={idx === 1 && cardsPerView === 3}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="my-14">
              {allTestimonials.length > 0 && (
                <div className="flex justify-center items-center gap-4 mb-4">
                  <motion.div variants={buttonVariants} whileHover="hover">
                    <button
                      className="h-[60px] w-[60px] items-center justify-center flex flex-col rounded-full z-50 cursor-pointer hover:bg-[#1976D2] bg-white/90 backdrop-blur-xl border border-blue-100 shadow-[0_8px_32px_rgba(59,130,246,0.1)]"
                      onClick={goToPrevious}
                    >
                      <MdChevronLeft
                        size={40}
                        className="text-blue-600 hover:text-white"
                      />
                    </button>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover">
                    <button
                      className="h-[60px] w-[60px] rounded-full items-center justify-center flex flex-col z-50 cursor-pointer hover:bg-[#1976D2] bg-white/90 backdrop-blur-xl border border-blue-100 shadow-[0_8px_32px_rgba(59,130,246,0.1)]"
                      onClick={goToNext}
                    >
                      <MdChevronRight
                        size={40}
                        className="text-blue-600 hover:text-white"
                      />
                    </button>
                  </motion.div>
                </div>
              )}

              {/* Pagination Dots */}
              {allTestimonials.length > 0 && (
                <div className="flex justify-center gap-2">
                  {allTestimonials.map((_, index) => (
                    <motion.div
                      key={index}
                      variants={dotVariants}
                      whileHover="hover"
                      className={`h-3 rounded-full cursor-pointer ${
                        index === currentIndex
                          ? "w-8 bg-blue-500"
                          : "w-3 bg-gray-300"
                      }`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TestimonialsSection);
