export async function updateParentStatus(
  parentId: string,
  newStatus: "activate" | "deactivate"
) {
  try {
    const response = await fetch(`/api/pet-parent/${parentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus === "activate" ? "active" : "inactive",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update status");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error };
  }
}

export async function deleteParent(parentId: string) {
  try {
    const response = await fetch(`/api/pet-parent/${parentId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete parent");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error deleting parent:", error);
    return { success: false, error };
  }
}
