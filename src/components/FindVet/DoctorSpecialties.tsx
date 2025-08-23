import { Badge } from "@/components/ui/badge";
import { Doctor } from "./DoctorCard";

export default function DoctorSpecialties({ doctor }: { doctor: Doctor }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
      <div className="flex flex-wrap gap-1">
        {doctor.specialties.slice(0, 2).map((specialty, index) => (
          <Badge
            key={index}
            className="bg-blue-100 text-blue-700 border-blue-300 text-xs"
          >
            {specialty}
          </Badge>
        ))}
        {doctor.specialties.length > 2 && (
          <Badge className="bg-gray-100 text-gray-600 border-gray-300 text-xs">
            +{doctor.specialties.length - 2} more
          </Badge>
        )}
      </div>
    </div>
  );
}
