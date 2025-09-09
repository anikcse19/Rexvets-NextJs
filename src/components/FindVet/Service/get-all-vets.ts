import config from "@/config/env.config";

export const getAllVets = async (
  queryParams?: Record<string, string | number>,
  timezone?: string
) => {
  // Build query params, ensuring all values are strings
  const params: Record<string, string> = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      params[key] = String(value);
    }
  }
  if (timezone) {
    params.timezone = timezone;
  }

  const query =
    Object.keys(params).length > 0
      ? "?" + new URLSearchParams(params).toString()
      : "";

  try {
    const res = await fetch(`${config.BASE_URL}/api/veterinarian${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      // Try to parse error body as JSON, otherwise fall back to text
      let errorBody: unknown = null;
      try {
        errorBody = await res.json();
      } catch {
        try {
          errorBody = await res.text();
        } catch {
          errorBody = null;
        }
      }

      const messageFromBody =
        (typeof errorBody === "object" && errorBody && (errorBody as any).message)
          || (typeof errorBody === "string" && errorBody)
          || undefined;

      const message =
        messageFromBody || `Request failed with status ${res.status}`;

      const error: any = new Error(message);
      error.status = res.status;
      error.statusText = res.statusText;
      error.data = errorBody;
      throw error;
    }

    return res.json();
  } catch (err: any) {
    // Network errors or unexpected failures
    if (err?.name === "AbortError") {
      const abortError: any = new Error("Request was aborted");
      abortError.code = "ABORT_ERR";
      throw abortError;
    }

    if (err instanceof TypeError && /fetch/i.test(err.message)) {
      const networkError: any = new Error("Network error while fetching veterinarians");
      networkError.code = "NETWORK_ERR";
      throw networkError;
    }

    throw err;
  }
};
