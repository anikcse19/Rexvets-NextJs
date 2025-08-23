import FindVetPage from "@/components/FindVet/FindVetPage";
import { getAllVets } from "@/components/FindVet/Service/get-all-vets";
import React from "react";

const page = async () => {
  const result = await getAllVets();
  console.log("result vet", result);
  return (
    <div>
      <FindVetPage doctors={result?.data} />
    </div>
  );
};

export default page;
