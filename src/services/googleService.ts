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

/**
 * The function `isCacheValid` checks if the cached data is still valid based on a timestamp and a
 * predefined cache duration.
 * @returns The function `isCacheValid` returns a boolean value.
 */
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

/**
 * The function `getCachedReviews` retrieves cached reviews from local storage if available, or returns
 * null if there are no cached reviews or an error occurs.
 * @returns The `getCachedReviews` function returns an array of `TransformedReview` objects if there
 * are cached reviews in the local storage. If there are no cached reviews or if an error occurs while
 * retrieving the cached reviews, it returns `null`.
 */
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

/**
 * The function `cacheReviews` stores transformed reviews in the browser's local storage with a
 * timestamp.
 * @param {TransformedReview[]} reviews - An array of transformed review objects.
 * @returns If the `checkWindow()` function returns false, the `cacheReviews` function will return
 * early without caching the reviews.
 */
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

/**
 * The function `getDefaultAvatar` generates a default avatar image URL based on the provided name.
 * @param {string} name - The `name` parameter is a string representing the name for which the avatar
 * is being generated.
 * @returns The function `getDefaultAvatar` returns a URL that generates a default avatar image using
 * the UI Avatars service. The URL includes the provided `name` parameter encoded as part of the query
 * string, along with other parameters for background color, text color, size, font size, and length.
 */
const getDefaultAvatar = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&color=fff&size=150&font-size=0.4&length=2`;
};
/**
 * The function `checkWindow` checks if the `window` object is defined in a TypeScript environment.
 * @returns The function `checkWindow` is returning a boolean value indicating whether the `window`
 * object is defined or not. If `window` is defined, it will return `true`, otherwise it will return
 * `false`.
 */
export const checkWindow = () => {
  return typeof window !== "undefined";
};
/**
 * The `formatReviewDate` function formats a timestamp into a human-readable date string or returns a
 * default "Recently" if no timestamp is provided.
 * @param {number} timestamp - The `timestamp` parameter is a number representing a date and time value
 * in seconds since the Unix epoch (January 1, 1970).
 * @param {string} [relativeTime] - The `relativeTime` parameter is an optional parameter that allows
 * you to specify a relative time string to be returned if the `timestamp` is not provided or if the
 * `checkWindow()` function returns false. If `relativeTime` is not provided, the default value is set
 * to "Recently".
 * @returns The function `formatReviewDate` returns a formatted date string in the format "Month Year"
 * based on the provided timestamp. If the timestamp is valid and the `checkWindow()` function returns
 * true, it formats the date using `toLocaleDateString` with the options for the year in numeric format
 * and the month in long format. If the timestamp is not valid or `checkWindow()` returns false, it
 */
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

/**
 * The function `transformGoogleReview` transforms a Google review object into a standardized format
 * for display.
 * @param {GoogleReview} googleReview - The `googleReview` parameter is an object that represents a
 * review from Google. It has the following properties:
 * @returns The function `transformGoogleReview` takes a `GoogleReview` object as input and returns a
 * `TransformedReview` object with properties such as name, text, image, date, rating, source,
 * verified, and originalReview.
 */
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

/**
 * The function `isLocalhost` checks if the current window location is localhost or 127.0.0.1.
 * @returns The function `isLocalhost` returns a boolean value indicating whether the current window's
 * hostname is "localhost", "127.0.0.1", or includes the substring "localhost".
 */
const isLocalhost = (): boolean => {
  return (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("localhost"))
  );
};

/**
 * The function `isJsonResponse` checks if a given HTTP response contains JSON data based on its
 * content type.
 * @param {Response} response - The `response` parameter in the `isJsonResponse` function is of type
 * `Response`, which likely represents a response object from a network request in a web application.
 * This object typically contains information such as the response headers, status, body content, etc.
 * @returns A boolean value indicating whether the response content type includes "application/json".
 */
const isJsonResponse = (response: Response): boolean => {
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json");
};

/**
 * The function `makeApiRequest` asynchronously fetches data from a specified API URL using various
 * proxies and fallback methods to handle CORS issues.
 * @returns The `makeApiRequest` function is returning a Promise that resolves to a `Response` object.
 * This `Response` object represents the response to the request made by the function to the specified
 * API endpoint.
 */
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
/**
 *
 */
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

/**
 *
 * @param minRating
 */
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

/**
 *
 */
export const clearCache = (): void => {
  if (!checkWindow()) {
    return;
  }
  localStorage.removeItem(CACHE_KEY);
};

/**
 *
 */
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
