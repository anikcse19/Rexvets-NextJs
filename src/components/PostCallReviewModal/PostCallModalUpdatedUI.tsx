import { IAppointment } from "@/models";
import { ExternalLink, Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface ICreateReview {
  rating: number;
  comment: string;
  appointmentDate: string;
  vetId: string;
  parentId: string;
  visible?: boolean;
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

const PostCallModalUpdatedUI: React.FC<PostCallModalProps> = ({
  isOpen,
  onClose,
  doctorId,
  docType = "Veterinarian",
  appointmentDetails,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;
  if (!appointmentDetails) return null;

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex: number) => {
    setHoverRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please add a comment before submitting");
      return;
    }

    try {
      if (
        !appointmentDetails ||
        !appointmentDetails.veterinarian ||
        (appointmentDetails as any).veterinarian === null ||
        !appointmentDetails.petParent ||
        (appointmentDetails as any).petParent === null
      ) {
        throw new Error("Missing appointment details");
      }

      setIsSubmitting(true);

      const vetId = extractId((appointmentDetails as any)?.veterinarian);
      const parentId = extractId((appointmentDetails as any)?.petParent);

      const reviewData: ICreateReview = {
        rating,
        comment: reviewText.trim(),
        appointmentDate: (appointmentDetails as any)?.appointmentDate as any,
        vetId: vetId as any,
        parentId: parentId as any,
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData?.message || `Failed to submit review: ${res.status}`
        );
      }
      const data = await res.json();
      toast.success(data?.message || "Review submitted successfully!");

      setReviewSubmitted(true);
      setIsSubmitted(true);

      setTimeout(() => {
        onClose();
        const url = `/dashboard/doctor/appointments/${
          (appointmentDetails as any)?._id
        }`;
        window.location.href = url;
      }, 20000);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create review";
      toast.error(errorMessage);
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleReview = () => {
    // Replace with your actual Google Business Profile URL
    window.open("https://business.google.com/reviews/write", "_blank");
  };

  const handleDonation = () => {
    // Replace with your actual donation URL
    window.open("https://your-donation-page.com", "_blank");
  };

  if (isSubmitted && reviewSubmitted) {
    return (
      <div className=" w-full mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-green-600 fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600">
            Your review has been submitted successfully.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitted(false)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Submit Another Review
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
        <h1 className="text-xl font-bold mb-2">
          Your feedback is valuable to us
        </h1>
        <p className="text-blue-100 text-sm">
          Thank you for choosing our veterinary services
        </p>
        <p className="text-blue-100 text-xs mt-1">
          Your feedback helps us provide better care for pets and their families
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Review Form */}
        <div className="space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Rate your experience
            </h3>
            <div className="flex justify-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && "We'd love to improve"}
                {rating === 2 && "Tell us how we can do better"}
                {rating === 3 && "Good, but room for improvement"}
                {rating === 4 && "Great experience!"}
                {rating === 5 && "Excellent! Thank you!"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label
              htmlFor="review"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Share your experience
            </label>
            <textarea
              id="review"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us about your visit and how we cared for your pet..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0 || !reviewText.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting…" : "Submit Review"}
          </button>
        </div>

        {/* Google Review Section */}
        <div className="border-t pt-6">
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Leave Google Review
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Share your experience on Google to help other pet parents.
            </p>
            <button
              onClick={handleGoogleReview}
              className="flex items-center justify-center w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Review on Google
            </button>
          </div>
        </div>

        {/* Support Mission Section */}
        <div className="border-t pt-6">
          <div className="bg-pink-50 rounded-lg p-4">
            <div className="text-center mb-3">
              <Heart className="w-6 h-6 text-pink-600 fill-current mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">
                Support Our Mission
              </h3>
            </div>
            <p className="text-sm text-gray-600 text-center mb-3">
              Help us continue providing quality veterinary care to pets
              everywhere.
            </p>
            <button
              onClick={() => router.push("/donate-now")}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Make a Donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCallModalUpdatedUI;
