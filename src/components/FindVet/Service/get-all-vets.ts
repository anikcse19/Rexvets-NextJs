const baseUrl = "http://localhost:3000";

export const getAllVets = async (
  queryParams?: Record<string, string | number>
) => {
  const query = queryParams
    ? "?" +
      new URLSearchParams(queryParams as Record<string, string>).toString()
    : "";

  const res = await fetch(`${baseUrl}/api/veterinarian${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch vets: ${res.statusText}`);
  }

  return res.json();
};
