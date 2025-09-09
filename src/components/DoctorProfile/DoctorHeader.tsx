import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Award, Building, Mail, MapPin, Phone, Star } from "lucide-react";

export default function DoctorHeader({ doctor }: { doctor: any }) {
  return (
    <Card className="shadow-xl border-0 bg-white overflow-hidden">
      <div
        style={{
          background: "linear-gradient(to right,#002366,#1a8693",
        }}
        className=" p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <Avatar className="w-32 h-32 border-4 border-white/20 shadow-xl">
            <AvatarImage src={doctor?.image} alt={doctor?.name} />
            <AvatarFallback className="text-3xl font-bold text-gray-800">
              {doctor?.name
                .split(" ")
                .map((n: string) => n.charAt(0))
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {doctor?.name}
            </h1>
            <p className="text-blue-100 text-lg mb-4">{doctor?.degree}</p>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  <Star
                    className={`w-5 h-5  "fill-yellow-400 text-yellow-400`}
                  />
                </div>
                <span className="text-white font-medium">
                  {doctor.rating} ({doctor.totalReviews} reviews)
                </span>
              </div>

              <Badge className="bg-white/20 text-white border-white/30">
                <Award className="w-4 h-4 mr-1" />
                {doctor?.experience} Experience
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-200" />
                <span className="text-blue-100">{doctor?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-200" />
                <span className="text-blue-100">{doctor?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-200" />
                <span className="text-blue-100">{doctor?.clinicName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-200" />
                <span className="text-blue-100">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
