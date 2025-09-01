import { Clock } from "lucide-react";
import { Veterinarian } from "./type";
import { getVetSlots } from "../DoctorProfile/service/get-vet-slots";
import { useEffect, useState } from "react";

export default function DoctorSlots({ doctor }: { doctor: Veterinarian }) {
  const [slots, setSlots] = useState<any[]>();

  const today = new Date().toISOString().split("T")[0];

  const fetchVetSlots = async () => {
    const data = await getVetSlots({
      id: doctor?._id,
      startDate: today,
      endDate: today,
    });
    // Sort by startTime (assumes format 'HH:mm')
    const sorted = (data || []).slice().sort((a: any, b: any) => {
      if (!a.startTime || !b.startTime) return 0;
      return a.startTime.localeCompare(b.startTime);
    });
    setSlots(sorted);
    // if (data && data.length > 0) {
    //   setVeterinarianTimezone(data[0]?.timezone || "UTC");
    //   console.log("Slot timezone conversion:", {
    //     userTimezone: currentTimezone,
    //     vetTimezone: data[0]?.timezone,
    //     sampleSlot: data[0],
    //   });
    // }
  };

  useEffect(() => {
    fetchVetSlots();
  }, [today]);

  console.log("slots", slots);
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
        <Clock className="w-4 h-4" />
        Today's Available Slots:
      </p>
      <div className="">
        {slots && slots?.length <= 0 ? (
          <p className="text-center text-gray-400">
            No available slots for today
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {slots?.slice(0, 2)?.map((slot, index) => (
              <div
                key={index}
                className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-center"
              >
                <p className="text-sm font-medium text-gray-900">
                  {slot.startTime}
                </p>
                <p className="text-xs text-gray-600">
                  {slot.timezone || "EST"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
