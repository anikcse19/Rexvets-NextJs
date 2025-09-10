import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PetParent } from "@/lib/types";
import { Calendar, PawPrint } from "lucide-react";
import React from "react";

const WelcomeSection = ({ petParentData }: { petParentData: PetParent }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <div
      style={{
        background: "linear-gradient(to right,#002366,#1a8693",
      }}
      className="relative overflow-hidden rounded-xl  p-8 text-white shadow-2xl"
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
        <div className="flex-shrink-0">
          <Avatar className="w-24 h-24 lg:w-28 lg:h-28 border-4 border-white/20 shadow-xl">
            <AvatarImage
              src={petParentData?.profileImage}
              alt={petParentData?.name}
            />
            <AvatarFallback className="text-2xl font-bold text-gray-800">
              {petParentData?.name
                .split(" ")
                .map((n) => n.charAt(0))
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Welcome back, {petParentData?.name}!
            </h1>
            <p className="text-blue-100 text-lg">
              Caring for your beloved pets since{" "}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <PawPrint className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {petParentData?.pets?.length}
                  </p>
                  <p className="text-blue-100 text-sm">Registered Pets</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Next Appointment</p>
                  <p className="text-blue-100 text-sm">
                    {formatDate(petParentData?.appointments?.appointmentDate)}{" "}
                    at{" "}
                    {formatTime(petParentData?.appointments?.appointmentDate)}{" "}
                    with Dr {petParentData?.appointments?.veterinarian?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
