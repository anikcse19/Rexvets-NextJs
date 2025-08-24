import config from "@/config/env.config";

export const getVetById = async (id: string) => {
  const res = await fetch(`${config.BASE_URL}/api/veterinarian/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch vets: ${res.statusText}`);
  }

  return res.json();
};
