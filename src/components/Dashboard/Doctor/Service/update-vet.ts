const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
export const updateVet = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/veterinarian/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  console.log("response from updateVet", res);

  if (!res.ok) {
    throw new Error(`Failed to update vet: ${res.statusText}`);
  }

  return res.json();
};
