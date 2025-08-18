import React from "react";
import { Star } from "lucide-react";
import { Review } from "@/lib/types";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium text-gray-900">{review.patientName}</h4>
          <div className="flex items-center gap-1 mt-1">
            {renderStars(review.rating)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">
            {new Date(review.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-xs text-blue-600 font-medium">
            {review.petType}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
