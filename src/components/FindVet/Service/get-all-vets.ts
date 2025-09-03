import config from "@/config/env.config";

export const getAllVets = async (
  queryParams?: Record<string, string | number>,
  timezone?: string
) => {
  // Add timezone to query params if provided
  const params = { ...queryParams };
  if (timezone) {
    params.timezone = timezone;
  }

  const query = Object.keys(params).length > 0
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";

  console.log("config.BASE_URL", config.BASE_URL);
  console.log("Fetching vets with timezone:", timezone);
  
  const res = await fetch(`${config.BASE_URL}/api/veterinarian${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch vets: ${res.statusText}`);
  }

  return res.json();
};
