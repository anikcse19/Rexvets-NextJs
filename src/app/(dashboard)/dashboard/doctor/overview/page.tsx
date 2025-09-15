import DoctorOverviewPage from "@/components/Dashboard/Doctor/DoctorOverviewPage";
import { authOptions } from "@/lib/auth";
import { checkVeterinarianStatus } from "@/lib/auth-helpers";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

import React from "react";

const page = async () => {
  const session: Session | null = await getServerSession(authOptions as any);

  const vetStatus = await checkVeterinarianStatus((session?.user as any).id);

  const vet = JSON.parse(JSON.stringify(vetStatus?.veterinarian));
  return (
    <div>
      <DoctorOverviewPage veterinarian={vet} />
    </div>
  );
};

export default page;
