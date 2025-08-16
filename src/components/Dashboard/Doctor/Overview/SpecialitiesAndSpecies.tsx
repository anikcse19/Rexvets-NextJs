import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Heart } from "lucide-react";
import React from "react";

const SpecialitiesAndSpecies = () => {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Specialities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Small Animal Surgery",
                level: "Expert",
                color: "bg-blue-100 text-blue-700",
              },
              {
                name: "Emergency Medicine",
                level: "Advanced",
                color: "bg-red-100 text-red-700",
              },
              {
                name: "Cardiology",
                level: "Expert",
                color: "bg-purple-100 text-purple-700",
              },
              {
                name: "Dermatology",
                level: "Advanced",
                color: "bg-green-100 text-green-700",
              },
              {
                name: "Orthopedics",
                level: "Intermediate",
                color: "bg-orange-100 text-orange-700",
              },
              {
                name: "Oncology",
                level: "Advanced",
                color: "bg-pink-100 text-pink-700",
              },
              {
                name: "Dental Care",
                level: "Expert",
                color: "bg-teal-100 text-teal-700",
              },
              {
                name: "Nutrition",
                level: "Advanced",
                color: "bg-yellow-100 text-yellow-700",
              },
            ].map((specialty, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <span className="font-medium text-gray-900">
                  {specialty.name}
                </span>
                <Badge className={`text-xs ${specialty.color}`}>
                  {specialty.level}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Species Treated */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            Species Treated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Dogs", count: "1,245", icon: "🐕" },
              { name: "Cats", count: "987", icon: "🐱" },
              { name: "Birds", count: "234", icon: "🐦" },
              { name: "Rabbits", count: "156", icon: "🐰" },
              { name: "Hamsters", count: "89", icon: "🐹" },
              { name: "Guinea Pigs", count: "67", icon: "🐹" },
              { name: "Ferrets", count: "45", icon: "🦫" },
              { name: "Reptiles", count: "34", icon: "🦎" },
            ].map((species, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-gray-50 text-center hover:bg-gray-100 transition-colors"
              >
                <div className="text-2xl mb-1">{species.icon}</div>
                <p className="font-semibold text-gray-900 text-sm">
                  {species.name}
                </p>
                <p className="text-xs text-gray-600">{species.count} treated</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialitiesAndSpecies;
