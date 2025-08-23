import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import DoctorInfo from "./DoctorInfo";
import DoctorLicense from "./DoctorLicense";
import DoctorSpecialties from "./DoctorSpecialties";
import DoctorSubscription from "./DoctorSubscription";
import DoctorSlots from "./DoctorSlots";
import DoctorProfileButton from "./DoctorProfileButton";
import DoctorHeader from "./DoctorHeader";
import { Veterinarian } from "./type";

export default function DoctorCard({ doctor }: { doctor: Veterinarian }) {
  return (
    <Link href={`/find-a-vet/${doctor.id}`}>
      <Card className="group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <CardContent className="p-0">
          <DoctorHeader doctor={doctor} />
          <div className="p-6 space-y-4">
            <DoctorInfo doctor={doctor} />
            <DoctorLicense doctor={doctor} />
            {/* <DoctorSpecialties doctor={doctor} /> */}
            <DoctorSubscription doctor={doctor} />
            {/* <DoctorSlots doctor={doctor} /> */}
            <DoctorProfileButton />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
