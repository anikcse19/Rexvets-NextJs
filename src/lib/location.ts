import { Location } from "./types";

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // In a real app, you'd use a proper geocoding service
          // For demo purposes, we'll simulate the reverse geocoding
          const mockAddress = await simulateReverseGeocode(latitude, longitude);
          resolve(mockAddress);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

const simulateReverseGeocode = async (
  lat: number,
  lng: number
): Promise<Location> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock addresses based on rough coordinates
  const mockAddresses = [
    {
      latitude: lat,
      longitude: lng,
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
    },
    {
      latitude: lat,
      longitude: lng,
      address: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
    },
    {
      latitude: lat,
      longitude: lng,
      address: "789 Pine Road",
      city: "Seattle",
      state: "WA",
    },
  ];

  return mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
};

export const searchLocation = async (query: string): Promise<Location[]> => {
  // Simulate location search
  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockResults: Location[] = [
    {
      latitude: 37.7749,
      longitude: -122.4194,
      address: query,
      city: "San Francisco",
      state: "CA",
    },
    {
      latitude: 34.0522,
      longitude: -118.2437,
      address: query,
      city: "Los Angeles",
      state: "CA",
    },
  ];

  return mockResults.filter(
    (location) =>
      location.city.toLowerCase().includes(query.toLowerCase()) ||
      location.address.toLowerCase().includes(query.toLowerCase())
  );
};
