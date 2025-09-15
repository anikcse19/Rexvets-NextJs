// lib/api/reviews.ts
export type ReviewInput = {
  rating: number;
  comment: string;
  appointmentDate: string;
  vetId: string;
  parentId: string;
  visible: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
  errorCode?: string;
};

export async function createReview(
  review: ReviewInput
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    const result: ApiResponse<any> = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      message: "Network or server error",
      errorCode: "NETWORK_ERROR",
    };
  }
}

export async function updateReviewStatus(id: string, status: boolean) {
  try {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: status }),
    });

    return await res.json();
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false };
  }
}

export async function updateReview(id: string, data: any) {
  try {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("Failed to update review:", error);
    return { success: false };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete review");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error };
  }
}
