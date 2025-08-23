import { Clock } from "lucide-react";
import { Veterinarian } from "./type";

export default function DoctorSlots({ doctor }: { doctor: Veterinarian }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
        <Clock className="w-4 h-4" />
        Next Available Slots:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {["10:00 AM", "2:00 PM", "4:00 PM"].map((slot, index) => (
          <div
            key={index}
            className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-center"
          >
            <p className="text-sm font-medium text-gray-900">{slot}</p>
            <p className="text-xs text-gray-600">{doctor.timezone || "EST"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
