import { IAppointment } from "@/models";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import PostCallModalReviewGoogleReviewSection from "./PostCallModalReviewGoogleReviewSection";
import PostCallReviewHeaderSection from "./PostCallReviewHeaderSection";
import PostCallReviewModalContainer from "./PostCallReviewModalContainer";
import PostCallReviewRatingSection from "./PostCallReviewRatingSection";
import PostCallReviewSupportSection from "./PostCallReviewSupportSection";

interface ICreateReview {
  rating: number; // 1 to 5
  comment: string; // 1 to 1000 chars
  appointmentDate: string; // ISO date string
  vetId: string; // MongoDB ObjectId as string
  parentId: string; // MongoDB ObjectId as string
  visible?: boolean; // optional, defaults to true
}

interface PostCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  docType?: string;
  appointmentDetails: IAppointment | null;
}

const extractId = (idData: any): string | null => {
  if (!idData) return null;

  if (typeof idData === "object" && idData?._id) {
    return idData._id.toString();
  } else if (typeof idData === "string") {
    return idData;
  }

  console.warn("Invalid ID format:", idData);
  return null;
};

// Modern Footer Component
const FooterSection: React.FC = () => (
  <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-200">
    <div className="text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <p className="text-sm text-emerald-700 font-medium">
          Thank you for choosing our veterinary services
        </p>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
      <p className="text-xs text-emerald-600">
        Your feedback helps us provide better care for pets and their families
      </p>
    </div>
  </div>
);

// Modern Success State Component
const SuccessState: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
    <div className="relative mb-8">
      <div className="w-28 h-28 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
        <svg
          className="w-14 h-14 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div className="absolute -inset-3 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-full opacity-30 animate-ping"></div>
    </div>

    <h3 className="text-4xl font-bold text-white mb-4">Review Submitted!</h3>
    <p className="text-slate-100 text-lg mb-8 max-w-md leading-relaxed">
      Thank you for your valuable feedback. Your review helps other pet parents
      make informed decisions.
    </p>

    <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-200">
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
      <span className="text-sm font-medium">
        Redirecting to Appointment Details page...
      </span>
    </div>
  </div>
);

const PostCallModal: React.FC<PostCallModalProps> = ({
  isOpen,
  onClose,
  doctorId,
  docType = "Veterinarian",
  appointmentDetails,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const router = useRouter();

  if (!isOpen) return null;
  console.log("appointment details:", appointmentDetails);
  if (!appointmentDetails) return null;

  const onCreateReview = async () => {
    setIsSubmitting(true);
    try {
      if (
        !appointmentDetails ||
        !appointmentDetails.veterinarian ||
        appointmentDetails.veterinarian === null ||
        !appointmentDetails.petParent ||
        appointmentDetails.petParent === null
      ) {
        throw new Error("Missing appointment details");
      }

      if (rating === 0) {
        throw new Error("Please select a rating before submitting");
      }

      if (!reviewText.trim()) {
        throw new Error("Please add a comment before submitting");
      }

      const vetId = extractId(appointmentDetails?.veterinarian);
      const parentId = extractId(appointmentDetails?.petParent);

      const reviewData: ICreateReview = {
        rating,
        comment: reviewText.trim(),
        appointmentDate: appointmentDetails?.appointmentDate as any,
        vetId: vetId as any,
        parentId: parentId as any,
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData?.message || `Failed to submit review: ${res.status}`
        );
      }

      const data = await res.json();
      console.log("Review submitted:", data);
      toast.success(data?.message || "Review submitted successfully!");

      setReviewSubmitted(true);
      setSubmitted(true);

      // Close modal and redirect to home after successful review
      setTimeout(() => {
        onClose();
        const url = `/dashboard/doctor/appointments/${appointmentDetails?._id}`;
        window.location.href = url;
      }, 20000);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create review";
      toast.error(errorMessage);
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success state if review was submitted
  if (submitted && reviewSubmitted) {
    return (
      <PostCallReviewModalContainer isOpen={isOpen} onClose={onClose}>
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <SuccessState onClose={onClose} />
          </div>
          <FooterSection />
        </div>
      </PostCallReviewModalContainer>
    );
  }

  return (
    <PostCallReviewModalContainer isOpen={isOpen} onClose={onClose}>
      <div
        style={{
          background:
            "linear-gradient(135deg, rgb(0, 35, 102) 20%, rgb(36, 36, 62) 25%, rgb(48, 43, 99) 50%, rgb(15, 52, 96) 75%, rgb(15, 12, 41) 100%)",
        }}
        className="h-screen flex justify-center flex-col"
      >
        {/* Modern Header */}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto ">
          <div className="max-w-6xl mx-auto p-6">
            <div className=" border-b border-slate-200 shadow-sm mb-3">
              <PostCallReviewHeaderSection onClose={onClose} />
            </div>
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3  px-6 py-3 rounded-full shadow-sm border border-slate-200 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-100 font-medium">
                  Review Session Active
                </span>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                How was your experience?
              </h2>
              <p className="text-slate-100">
                Your feedback helps us improve our services
              </p>
            </div>

            {/* Main Review Form */}
            <div className=" rounded-2xl shadow-lg  p-8 mb-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Rating & Review */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-slate-100 mb-4">
                      Rate Your Experience
                    </h3>
                    <PostCallReviewRatingSection
                      rating={rating}
                      hoveredRating={hoveredRating}
                      setRating={setRating}
                      setHoveredRating={setHoveredRating}
                      reviewText={reviewText}
                      setReviewText={setReviewText}
                      isSubmitting={isSubmitting}
                      setIsSubmitting={setIsSubmitting}
                      submitted={submitted}
                      setSubmitted={setSubmitted}
                      reviewSubmitted={reviewSubmitted}
                      setReviewSubmitted={setReviewSubmitted}
                      onCreateReview={onCreateReview}
                    />
                  </div>
                </div>

                {/* Right Column - Google Review */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-slate-100 mb-4">
                      Leave a Google Review
                    </h3>
                    <div className=" rounded-xl p-6 ">
                      <PostCallModalReviewGoogleReviewSection />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className=" rounded-2xl p-8 border border-gray-100">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">
                  Support Our Mission
                </h3>
                <PostCallReviewSupportSection
                  onClick={() => router.push("/donate-now")}
                />
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-6 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    Your feedback is valuable to us
                  </span>
                </div>

                {rating > 0 && reviewText.trim() && (
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Ready to submit</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Footer */}
          <FooterSection />
        </div>
      </div>
    </PostCallReviewModalContainer>
  );
};

export default PostCallModal;
