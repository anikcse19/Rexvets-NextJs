// src/app/find-vet/page.tsx
import { NextPage } from "next";

// Define the type for a veterinarian (adjust based on your API response)
interface Veterinarian {
  id: number;
  name: string;
  specialty?: string;
  // Add other fields as per your API response
}

// Function to fetch available veterinarians
async function getAvailableVets(): Promise<Veterinarian[]> {
  try {
    // Use the full URL for the API route in production or relative for development
    const response = await fetch(
      `/api/veterinarian`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch available vets");
    }

    const data: Veterinarian[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching available vets:", error);
    return [];
  }
}

// Define the page component
const FindVetPage: NextPage = async () => {
  const vets = await getAvailableVets();
  console.log("Available Vets:", vets);

  return (
    <div>
      <h1>Hello Junaid</h1>
      <ul>
        {vets.length > 0 ? (
          vets.map((vet) => (
            <li key={vet.id}>
              {vet.name} {vet.specialty && `- ${vet.specialty}`}
            </li>
          ))
        ) : (
          <p>No veterinarians available.</p>
        )}
      </ul>
    </div>
  );
};

export default FindVetPage;
