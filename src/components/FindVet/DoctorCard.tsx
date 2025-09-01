import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import DoctorHeader from "./DoctorHeader";
import DoctorInfo from "./DoctorInfo";
import DoctorLicense from "./DoctorLicense";
import DoctorProfileButton from "./DoctorProfileButton";
import DoctorSubscription from "./DoctorSubscription";
import { Veterinarian } from "./type";

export default function DoctorCard({ doctor }: { doctor: Veterinarian }) {
  return (
    <article itemScope itemType="https://schema.org/Veterinary" className="group">
      <Link href={`/find-a-vet/${doctor.id}`}>
        <Card className="group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <CardContent className="p-0">
            <DoctorHeader doctor={doctor} />
            <div className="p-6 space-y-4">
              <DoctorInfo doctor={doctor} />
              <DoctorLicense doctor={doctor} />
              {/* <DoctorSpecialties doctor={doctor} /> */}
              <DoctorSubscription />
              {/* <DoctorSlots doctor={doctor} /> */}
              <DoctorProfileButton />
            </div>
          </CardContent>
        </Card>
      </Link>
      
      {/* Hidden structured data for SEO */}
      <div style={{ display: 'none' }}>
        <meta itemProp="name" content={doctor.name} />
        <meta itemProp="description" content={`Veterinarian ${doctor.name} specializing in ${doctor.specialization || 'pet care'}`} />
        <meta itemProp="url" content={`https://www.rexvet.org/find-a-vet/${doctor.id}`} />
        {doctor.phoneNumber && <meta itemProp="telephone" content={doctor.phoneNumber} />}
        {doctor.state && <meta itemProp="addressRegion" content={doctor.state} />}
        {doctor.specialization && <meta itemProp="specialty" content={doctor.specialization} />}
        {doctor.profileImage && <meta itemProp="image" content={doctor.profileImage} />}
        {doctor.bio && <meta itemProp="description" content={doctor.bio} />}
      </div>
    </article>
  );
}
