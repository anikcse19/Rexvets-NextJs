import AppointmentConfirmationPage from "@/components/AppointmentConfirmation/AppointmentConfirmationPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import { PetParentModel } from "@/models";
import React, { Suspense } from "react";
import Loader from "@/components/shared/Loader";

const page = async () => {
  // Server-side access check
  const session = await getServerSession(authOptions as any);

  if (!(session as any)?.user?.refId) {
    redirect("/auth/signin");
  }

  try {
    await connectToDatabase();

    // Check donation status server-side
    const petParent = await PetParentModel.findOne({
      _id: (session as any).user.refId,
      isActive: true,
    }).select("donationPaid");

    if (!petParent || !petParent.donationPaid) {
      redirect("/donate");
    }
  } catch (error) {
    console.error("Error checking access:", error);
    redirect("/donate");
  }

  return (
    <div>
      <Suspense fallback={<Loader size={60} />}>
        <AppointmentConfirmationPage />
      </Suspense>
    </div>
  );
};

export default page;
