import DoctorProfilePage from "@/components/DoctorProfile/DoctorProfilePage";
import React from "react";

const page = () => {
  const selectedDoctor = {
    id: "1",
    name: "Dr. Sarah Johnson",
    image:
      "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400",
    degree: "DVM, MS",
    rating: 4.9,
    reviewCount: 124,
    license: "VET-2019-CA-5431",
    prescriptionBadge: true,
    state: "California",
    specialties: ["Small Animal Medicine", "Surgery", "Emergency Care"],
    bio: "Dr. Sarah Johnson is a passionate veterinarian with over 8 years of experience in small animal medicine. She specializes in emergency care and surgical procedures, with a particular interest in minimally invasive techniques.",
    address: "123 Pet Care Blvd, San Francisco, CA 94105",
    speciesTreated: ["Dogs", "Cats", "Rabbits", "Guinea Pigs"],
    availableSlots: [
      { id: "1", date: "2025-08-20", time: "09:00", available: true },
      { id: "2", date: "2025-08-20", time: "10:30", available: true },
      { id: "3", date: "2025-08-20", time: "14:00", available: true },
      { id: "4", date: "2025-08-21", time: "11:00", available: true },
      { id: "5", date: "2025-08-21", time: "15:30", available: true },
    ],
  };
  return (
    <div>
      <DoctorProfilePage doctor={selectedDoctor} />
    </div>
  );
};

export default page;
