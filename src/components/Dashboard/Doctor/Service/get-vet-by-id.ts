const baseUrl = "http://localhost:3000";

export const getVetByIdDashboard = async (id: string) => {
  const res = await fetch(`${baseUrl}/api/veterinarian/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch vets: ${res.statusText}`);
  }

  return res.json();
};
