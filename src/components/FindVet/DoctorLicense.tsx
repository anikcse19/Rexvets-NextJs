import { Award } from "lucide-react";
import { Doctor } from "./DoctorCard";

export default function DoctorLicense({ doctor }: { doctor: Doctor }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
      <Award className="w-4 h-4 text-green-600" />
      <div>
        <p className="text-xs text-green-700 font-medium">
          Licensed & Verified
        </p>
        <p className="text-xs text-green-600">{doctor.licenseNumber}</p>
      </div>
    </div>
  );
}
