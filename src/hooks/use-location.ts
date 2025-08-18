import { getCurrentLocation } from "@/lib/location";
import { Location } from "@/lib/types";
import { useState, useEffect } from "react";

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
      localStorage.setItem("userLocation", JSON.stringify(currentLocation));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location");
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = (newLocation: Location) => {
    setLocation(newLocation);
    localStorage.setItem("userLocation", JSON.stringify(newLocation));
  };

  useEffect(() => {
    // Try to load saved location from localStorage
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (err) {
        console.error("Failed to parse saved location");
      }
    }
  }, []);

  return {
    location,
    loading,
    error,
    fetchCurrentLocation,
    updateLocation,
  };
};
