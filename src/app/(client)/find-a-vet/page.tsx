import FindVetPage from "@/components/FindVet/FindVetPage";
import { getAllVets } from "@/components/FindVet/Service/get-all-vets";
import React, { Suspense } from "react";

// Make this page dynamic to avoid build-time API calls
export const dynamic = "force-dynamic";

const page = async () => {
  try {
    const result = await getAllVets();
    console.log("result vet", result);
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <FindVetPage doctors={result?.data} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error fetching veterinarians:", error);
    // Return empty data if API fails
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <FindVetPage
            doctors={{
              veterinarians: [],
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                pages: 0,
              },
            }}
          />
        </Suspense>
      </div>
    );
  }
};

export default page;
