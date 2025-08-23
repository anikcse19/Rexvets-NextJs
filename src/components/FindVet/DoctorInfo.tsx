import { Star } from "lucide-react";
import { Veterinarian } from "./type";

export default function DoctorInfo({ doctor }: { doctor: Veterinarian }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
        {doctor.name}
      </h3>
      <p className="text-gray-600 text-sm mb-2">{doctor.education?.[0] || doctor.specialization}</p>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < 4 // Default rating of 4/5 stars for now
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">
          4.0 (Reviews coming soon)
        </span>
      </div>
    </div>
  );
}
