import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function ClinicAddress({ doctor }: { doctor: any }) {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          Clinic Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
          <p className="font-semibold text-red-900 mb-1">
            {doctor?.clinicName}
          </p>
          <p className="text-red-700">{doctor?.address}</p>
        </div>
      </CardContent>
    </Card>
  );
}
