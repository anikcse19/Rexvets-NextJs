import RatesAndAvailabilityPage from "@/components/Dashboard/Doctor/RatesAndAvailabilityPage";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

import { getVetByIdDashboard } from "@/components/Dashboard/Doctor/Service/get-vet-by-id";
import { checkVeterinarianStatus } from "@/lib/auth-helpers";
import React from "react";

const page = async () => {
  const session: Session | null = await getServerSession(authOptions as any);

  const vetStatus = await checkVeterinarianStatus((session?.user as any).id);

  const vet = JSON.parse(JSON.stringify(vetStatus?.veterinarian));

  return (
    <div>
      <RatesAndAvailabilityPage vetData={vet} />
    </div>
  );
};

export default page;
