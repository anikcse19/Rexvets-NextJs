"use client";
import React, { useEffect, useState } from "react";
import AccountPage from "@/components/Dashboard/PetParent/AccountPage";
import { useSession } from "next-auth/react";
import { PetParent } from "@/lib/types";
import { toast } from "sonner";

const page = () => {
  const { data: session } = useSession();
  const [petParentData, setPetParentData] = useState<PetParent>();
  const fetchPetParent = async () => {
    try {
      const res = await fetch(`/api/pet-parent/${session?.user?.refId}`);
      if (!res?.ok) {
        throw new Error();
      }

      const data = await res.json();

      console.log(data?.data);
      setPetParentData(data?.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (session) {
      fetchPetParent();
    }
  }, [session]);
  return (
    <div>
      <AccountPage petParentData={petParentData!} />
    </div>
  );
};

export default page;
