import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, User } from "lucide-react";

export default function AboutDoctor({ doctor }: { doctor: any }) {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          About Dr. {doctor?.name.split(" ")[1]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">{doctor?.bio}</p>
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 text-white p-2 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-green-900">
                Licensed & Verified
              </p>
              <p className="text-green-700 text-sm">
                License: {doctor?.licenses[0]?.licenseNumber}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
