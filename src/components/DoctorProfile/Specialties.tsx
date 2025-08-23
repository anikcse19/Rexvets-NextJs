import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope } from "lucide-react";

export default function Specialties({ doctor }: { doctor: any }) {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-purple-600" />
          Specialties
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {doctor?.specialties?.map((specialty: string, i: number) => (
            <Badge
              key={i}
              className="bg-purple-100 text-purple-700 border-purple-300 justify-center py-2"
            >
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
