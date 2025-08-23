const baseUrl = "http://localhost:3000";

export const getVetByIdDashboard = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // First get the user to find the veterinarian reference
  const userRes = await fetch(`${baseUrl}/api/debug/user-status`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!userRes.ok) {
    throw new Error("Failed to get user status");
  }

  const userData = await userRes.json();
  
  if (!userData.user?.veterinarianRef) {
    throw new Error("Veterinarian profile not found");
  }

  // Now fetch the veterinarian data using the veterinarian ID
  const res = await fetch(`${baseUrl}/api/veterinarian/${userData.user.veterinarianRef}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch veterinarian: ${res.statusText}`);
  }

  return res.json();
};
