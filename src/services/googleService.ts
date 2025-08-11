/* eslint-disable @typescript-eslint/no-explicit-any */
// services/googlePlaces.ts
"use client";

interface GoogleReview {
  author_name: string;
  text: string;
  profile_photo_url?: string;
  time: number;
  relative_time_description?: string;
  rating: number;
  [key: string]: any;
}

interface TransformedReview {
  name: string;
  text: string;
  image: string;
  date: string;
  rating: number;
  source: "google";
  verified: boolean;
  originalReview: GoogleReview;
}

interface CacheInfo {
  exists: boolean;
  age?: number;
  isValid?: boolean;
  expiresIn?: number;
  error?: string;
}

// --- Config ---
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
const BASE_URL = "https://maps.googleapis.com/maps/api/place";
const CACHE_KEY = "google_reviews_cache";
const CACHE_DURATION =
  parseInt(process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_CACHE_DURATION || "0") ||
  3600000; // 1 hour default

// --- Cache Helpers ---
const isCacheValid = (): boolean => {
  if (!checkWindow()) {
    return false;
  }
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return false;
  try {
    const { timestamp } = JSON.parse(cached);
    return Date.now() - timestamp < CACHE_DURATION;
  } catch (error) {
    console.error("Error parsing cached reviews:", error);
    return false;
  }
};

const getCachedReviews = (): TransformedReview[] | null => {
  if (!checkWindow()) {
    return null;
  }
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }
  } catch (error) {
    console.error("Error getting cached reviews:", error);
  }
  return null;
};

const cacheReviews = (reviews: TransformedReview[]): void => {
  try {
    if (!checkWindow()) {
      return;
    }
    const cacheData = {
      timestamp: Date.now(),
      data: reviews,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error caching reviews:", error);
  }
};

// --- Data Helpers ---
const getDefaultAvatar = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&color=fff&size=150&font-size=0.4&length=2`;
};
export const checkWindow = () => {
  return typeof window !== "undefined";
};
const formatReviewDate = (timestamp: number, relativeTime?: string): string => {
  if (timestamp && checkWindow()) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  }
  return relativeTime || "Recently";
};

const transformGoogleReview = (
  googleReview: GoogleReview
): TransformedReview => {
  return {
    name: googleReview.author_name,
    text: googleReview.text,
    image:
      googleReview.profile_photo_url ||
      getDefaultAvatar(googleReview.author_name),
    date: formatReviewDate(
      googleReview.time,
      googleReview.relative_time_description
    ),
    rating: googleReview.rating,
    source: "google",
    verified: true,
    originalReview: googleReview,
  };
};

// --- Request Helpers ---
const isLocalhost = (): boolean => {
  return (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("localhost"))
  );
};

const isJsonResponse = (response: Response): boolean => {
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json");
};

const makeApiRequest = async (): Promise<Response> => {
  const url = `${BASE_URL}/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`;

  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    // `https://thingproxy.freeboard.io/fetch/${url}`, // Removed broken proxy
    `https://cors.bridged.cc/${url}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  if (isLocalhost()) {
    for (const proxy of proxies) {
      try {
        const response = await fetch(proxy);
        if (response.ok) return response;
      } catch {
        // try next proxy
      }
    }
    // Try direct fetch as last resort on localhost (may fail due to CORS)
    try {
      const directResponse = await fetch(url);
      if (directResponse.ok) return directResponse;
    } catch {}

    throw new Error("All CORS proxies failed");
  }

  // Production: try Next.js API route first
  try {
    const localProxyUrl = `/api/google-reviews?place_id=${PLACE_ID}`;
    const response = await fetch(localProxyUrl);
    if (response.ok && isJsonResponse(response)) {
      return response;
    }
  } catch {
    // fallback to proxies
  }

  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy);
      if (response.ok) return response;
    } catch {
      // try next
    }
  }

  // Try direct fetch as very last fallback (likely CORS blocked)
  try {
    const directResponse = await fetch(url);
    if (directResponse.ok) return directResponse;
  } catch {}

  throw new Error("All CORS proxies failed in production");
};

// --- Main API ---
export const fetchReviews = async (): Promise<TransformedReview[]> => {
  if (isCacheValid()) {
    return getCachedReviews() ?? [];
  }

  if (!API_KEY || !PLACE_ID) {
    throw new Error("Google Places API key or Place ID not configured");
  }

  try {
    const response = await makeApiRequest();
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== "OK") {
      throw new Error(
        `Google Places API error: ${data.status} - ${
          data.error_message || "Unknown error"
        }`
      );
    }

    const reviews: GoogleReview[] = data.result?.reviews || [];
    const transformed = reviews.map(transformGoogleReview);
    cacheReviews(transformed);
    return transformed;
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    const cached = getCachedReviews();
    if (cached) return cached;
    throw error;
  }
};

export const getFilteredReviews = async (
  minRating = 4
): Promise<TransformedReview[]> => {
  try {
    const reviews = await fetchReviews();
    return reviews.filter((r) => r.rating >= minRating);
  } catch (error) {
    console.error("Error getting filtered reviews:", error);
    return [];
  }
};

export const clearCache = (): void => {
  if (!checkWindow()) {
    return;
  }
  localStorage.removeItem(CACHE_KEY);
};

export const getCacheInfo = (): CacheInfo | undefined => {
  try {
    if (!checkWindow()) {
      return;
    }
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      return {
        exists: true,
        age,
        isValid: age < CACHE_DURATION,
        expiresIn: Math.max(0, CACHE_DURATION - age),
      };
    }
    return { exists: false };
  } catch (error: any) {
    return { exists: false, error: error.message };
  }
};
