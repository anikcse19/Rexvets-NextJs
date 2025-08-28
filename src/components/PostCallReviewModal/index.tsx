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

// FooterSection Component
const FooterSection: React.FC = () => (
  <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-500">
    Thank you for choosing our veterinary services.
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
  if (!isOpen || docType !== "Parent") return null;
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
      const reviewData: ICreateReview = {
        rating,
        comment: reviewText,
        appointmentDate: appointmentDetails?.appointmentDate as any,
        vetId: appointmentDetails?.veterinarian as any,
        parentId: appointmentDetails?.petParent as any,
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        throw new Error(`Failed to submit review: ${res.body}`);
      }

      const data = await res.json();
      console.log("Review submitted:", data);

      setReviewSubmitted(true);
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to create review");
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PostCallReviewModalContainer isOpen={isOpen} onClose={onClose}>
      <PostCallReviewHeaderSection onClose={onClose} />
      <div className="p-5 grid md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          <PostCallModalReviewGoogleReviewSection />
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
        <div className="flex flex-col gap-5">
          <PostCallReviewSupportSection
            onClick={() => router.push("/donate-now")}
          />
        </div>
      </div>
      <FooterSection />
    </PostCallReviewModalContainer>
  );
};

export default PostCallModal;
