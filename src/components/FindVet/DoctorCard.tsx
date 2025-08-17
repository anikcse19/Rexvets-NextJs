import React from "react";
import { Star, MapPin, Badge, Calendar, Users } from "lucide-react";
import { Doctor } from "@/lib/types";
import { formatTimeToUserTimezone } from "@/lib/timezone";

interface DoctorCardProps {
  doctor: Doctor;
  onClick: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  const getNextTwoSlots = () => {
    const today = new Date().toISOString().split("T")[0];
    const availableToday = doctor.availableSlots
      .filter((slot) => slot.available && slot.date >= today)
      .sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`).getTime() -
          new Date(`${b.date} ${b.time}`).getTime()
      )
      .slice(0, 2);

    return availableToday;
  };

  const nextSlots = getNextTwoSlots();

  return (
    <div
      onClick={() => onClick(doctor)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 group"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            />
            {doctor.prescriptionBadge && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <Badge className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {doctor.name}
            </h3>
            <p className="text-sm text-gray-600">{doctor.degree}</p>

            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">
                {doctor.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({doctor.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge className="w-4 h-4" />
            <span>License: {doctor.license}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{doctor.state}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600 font-medium">
            Subscribe to Family Plan
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Calendar className="w-4 h-4" />
            <span>Next Available</span>
          </div>

          {nextSlots.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {nextSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-center"
                >
                  <div className="text-xs text-green-600 font-medium">
                    {new Date(slot.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-green-800 font-semibold">
                    {formatTimeToUserTimezone(slot.time)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <div className="text-sm text-gray-600">No available slots</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
