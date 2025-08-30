"use client";
import { motion } from "framer-motion";
import React from "react";
import { toast } from "sonner";
interface IProps {
  rating: number;
  hoveredRating: number;
  setRating: (value: number) => void;
  setHoveredRating: (value: number) => void;
  reviewText: string;
  setReviewText: (value: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  submitted: boolean;
  setSubmitted: (value: boolean) => void;
  reviewSubmitted: boolean;
  setReviewSubmitted: (value: boolean) => void;
  onCreateReview?: () => void;
}
const PostCallReviewRatingSection: React.FC<IProps> = ({
  rating,
  hoveredRating,
  setRating,
  setHoveredRating,
  reviewText,
  setReviewText,
  isSubmitting,
  setIsSubmitting,
  submitted,
  setSubmitted,
  reviewSubmitted,
  setReviewSubmitted,
  onCreateReview,
}) => {
  const handleStarClick = (starValue: number) => setRating(starValue);
  const handleStarHover = (starValue: number) => setHoveredRating(starValue);
  const handleStarLeave = () => setHoveredRating(0);

  return (
    <div className="bg-[#120F2C] rounded-xl p-5 border border-[#002366]">
      <div className="flex items-center mb-4">
        <div className="w-9 h-9 bg-[#002366] rounded-full flex items-center justify-center mr-2.5 text-white text-base">
          ⭐
        </div>
        <h3 className="text-lg font-semibold text-white m-0">
          Rate Your Doctor
        </h3>
      </div>
      <div className="flex justify-center gap-2 mb-2.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
            className={`bg-transparent border-none cursor-pointer text-3xl p-1 rounded-full transition-all ${
              (hoveredRating || rating) >= star
                ? "text-yellow-400"
                : "text-gray-500"
            }`}
          >
            ★
          </motion.button>
        ))}
      </div>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience with the doctor (optional)..."
        disabled={reviewSubmitted}
        className={`w-full min-h-[80px] p-3 border-2 border-[#002366] rounded-lg text-sm font-inter resize-y mb-3 outline-none transition-all ${
          reviewSubmitted
            ? "bg-[#002366] text-white"
            : "bg-[#002366] text-white"
        } focus:border-[#002366] focus:shadow-[0_0_0_2px_rgba(0,35,102,0.1)] box-border leading-tight`}
        maxLength={500}
      />
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-gray-500">
          {reviewText.length}/500 characters
        </span>
      </div>
      {!reviewSubmitted ? (
        <motion.button
          whileHover={{ y: -1, boxShadow: "0 4px 12px rgba(0, 35, 102, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!(rating > 0) && !reviewText.trim()) {
              toast.error("Please provide a rating or a review.");
              return;
            }
            onCreateReview?.();
            // setIsSubmitting(true);
            // setTimeout(() => {
            //   setSubmitted(true);
            //   setReviewSubmitted(true);
            //   setIsSubmitting(false);
            // }, 1000);
          }}
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg text-sm font-semibold transition-all ${
            rating > 0 || reviewText.trim()
              ? "bg-[#002366] text-white cursor-pointer"
              : "bg-[rgba(255,255,255,0.2)] text-gray-500 cursor-not-allowed"
          } ${isSubmitting ? "opacity-70" : "opacity-100"}`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </motion.button>
      ) : (
        <div className="bg-[#002366] text-white py-3 px-4 rounded-lg text-sm font-semibold text-center flex items-center justify-center gap-1.5">
          <span className="text-base">✓</span>
          Thank you for your feedback!
        </div>
      )}
    </div>
  );
};

export default React.memo(PostCallReviewRatingSection);
