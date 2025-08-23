import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function DoctorProfileButton() {
  return (
    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group-hover:scale-105 transition-transform">
      <Users className="w-4 h-4 mr-2" />
      View Profile & Book
    </Button>
  );
}
