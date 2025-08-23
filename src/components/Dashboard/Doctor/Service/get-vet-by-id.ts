const baseUrl = "http://localhost:3000";

export const getVetByIdDashboard = async (id: string) => {
  console.log("Fetching vet with id:", id); // Add this line
  const res = await fetch(`${baseUrl}/api/veterinarian/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensure cookies are sent with the request
  });
  console.log("response from getVetByIdDashboard", res);
  if (!res.ok) {
    throw new Error(`Failed to fetch vets: ${res.statusText}`);
  }

  return res.json();
};
