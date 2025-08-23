import { Star } from "lucide-react";
import { Doctor } from "./DoctorCard";

export default function DoctorInfo({ doctor }: { doctor: Doctor }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
        {doctor.name}
      </h3>
      <p className="text-gray-600 text-sm mb-2">{doctor.degree}</p>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(doctor.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {doctor.rating} ({doctor.totalReviews} reviews)
        </span>
      </div>
    </div>
  );
}
