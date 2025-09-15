import config from "@/config/env.config";

export const updateVet = async (data: any) => {
  const res = await fetch(`${config.BASE_URL}/api/veterinarian/update`, {
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
