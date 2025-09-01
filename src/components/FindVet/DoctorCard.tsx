import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import DoctorInfo from "./DoctorInfo";
import DoctorLicense from "./DoctorLicense";
import DoctorSubscription from "./DoctorSubscription";
import DoctorProfileButton from "./DoctorProfileButton";
import DoctorHeader from "./DoctorHeader";
import { Veterinarian } from "./type";
import { getVetSlots } from "../DoctorProfile/service/get-vet-slots";
import DoctorSlots from "./DoctorSlots";

export default function DoctorCard({ doctor }: { doctor: Veterinarian }) {
  return (
    <Link href={`/find-a-vet/${doctor.id}`}>
      <Card className="group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
        <CardContent className="p-0 h-full flex flex-col">
          <DoctorHeader doctor={doctor} />
          <div className="p-6 flex flex-col justify-between gap-3 flex-grow">
            <div className="space-y-4 flex-grow">
              <DoctorInfo doctor={doctor} />
              <DoctorLicense doctor={doctor} />
              {/* <DoctorSpecialties doctor={doctor} /> */}
              <DoctorSubscription />
              <DoctorSlots doctor={doctor} />
            </div>
            <div className="mt-auto">
              <DoctorProfileButton />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
