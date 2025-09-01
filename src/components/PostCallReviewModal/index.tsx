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

      if (rating === 0) {
        throw new Error("Please select a rating before submitting");
      }

      if (!reviewText.trim()) {
        throw new Error("Please add a comment before submitting");
      }
      const vetId = extractId(appointmentDetails?.veterinarian);
      const parentId = extractId(appointmentDetails?.petParent);

      // const vetId =
      //   typeof appointmentDetails?.veterinarian === "string"
      //     ? appointmentDetails?.veterinarian
      //     : appointmentDetails?.veterinarian?._id;
      // const parentId =
      //   typeof appointmentDetails?.petParent === "string"
      //     ? appointmentDetails?.petParent
      //     : appointmentDetails?.petParent?._id;
      // console.log("vetId:", vetId);
      // console.log("parentId:", parentId);
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
        router.push("/");
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create review";
      toast.error(errorMessage);
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
