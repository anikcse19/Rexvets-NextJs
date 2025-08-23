import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Doctor } from "./DoctorCard";

export default function DoctorHeader({ doctor }: { doctor: Doctor }) {
  return (
    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <Avatar className="absolute bottom-4 left-4 w-20 h-20 border-4 border-white shadow-lg">
        <AvatarImage
          src={doctor.image}
          alt={doctor.name}
          className="object-cover"
        />
        <AvatarFallback className="text-xl font-bold text-gray-800 bg-gradient-to-br from-blue-100 to-purple-100">
          {doctor.name
            .split(" ")
            .map((n) => n.charAt(0))
            .join("")}
        </AvatarFallback>
      </Avatar>

      {/* State Badge */}
      <div className="absolute top-4 right-4">
        <Badge className="bg-white/90 text-gray-700 border-0">
          <MapPin className="w-3 h-3 mr-1" />
          {doctor.state}
        </Badge>
      </div>
    </div>
  );
}
