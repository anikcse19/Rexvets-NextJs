import config from "@/config/env.config";


export const getAllVets = async (
  queryParams?: Record<string, string | number>
) => {
  const query = queryParams
    ? "?" +
      new URLSearchParams(queryParams as Record<string, string>).toString()
    : "";

  console.log("config.BASE_URL", config.BASE_URL);
  const res = await fetch(`${config.BASE_URL}/api/veterinarian${query}`, {
   
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch vets: ${res.statusText}`);
  }

  return res.json();
};
