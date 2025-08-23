import { Badge } from "@/components/ui/badge";
import { Veterinarian } from "./type";

export default function DoctorSpecialties({ doctor }: { doctor: Veterinarian }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
      <div className="flex flex-wrap gap-1">
        {[doctor.specialization].filter(Boolean).slice(0, 2).map((specialty, index) => (
          <Badge
            key={index}
            className="bg-blue-100 text-blue-700 border-blue-300 text-xs"
          >
            {specialty}
          </Badge>
        ))}
        {/* Show +more badge if there are additional specialties (placeholder for future enhancement) */}
      </div>
    </div>
  );
}
