import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

export default function SpeciesTreated({ doctor }: { doctor: any }) {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-600" />
          Species Treated
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctor?.speciesTreated?.map((species: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200"
            >
              <div>
                <p className="font-semibold text-pink-900">{species.name}</p>
                <p className="text-pink-700 text-sm">{species.count} treated</p>
              </div>
              <Badge
                className={`${
                  species.experience === "Expert"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : species.experience === "Advanced"
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-yellow-100 text-yellow-700 border-yellow-300"
                }`}
              >
                {species.experience}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
