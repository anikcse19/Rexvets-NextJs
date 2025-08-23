import AccountPage from "@/components/Dashboard/Doctor/AccountPage";
import { getVetByIdDashboard } from "@/components/Dashboard/Doctor/Service/get-vet-by-id";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);
  console.log("session from server side", session);
  const accountData = await getVetByIdDashboard(session?.user?.id || "");
  console.log("accountData from server side", accountData);

  return (
    <div>
      <AccountPage doctorData={accountData?.data?.veterinarian} />
    </div>
  );
};

export default page;
