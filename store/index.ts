import { DriverStore, LocationStore, MarkerData } from "@/type";
import { create } from "zustand";

export const useLocationStore = create<LocationStore>((set, get) => ({
  userAddress: null,
  userLatitude: null,
  userLongitude: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  coordinates: [],

  setUserLocation: ({ latitude, longitude, address }) => {
    set({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    });
  },

  setDestinationLocation: async ({ latitude, longitude, address }) => {
    const { userLatitude, userLongitude, fetchRoute } = get();

    set({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    });

    if (userLatitude && userLongitude) {
      const apiKey = process.env.EXPO_PUBLIC_ORS_API_KEY!;
      const route = await fetchRoute(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude, longitude },
        apiKey
      );

      set({ coordinates: route });
    }
  },

  fetchRoute: async (origin, destination, apiKey, profile = "driving-car") => {
    try {
      const url = `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${apiKey}&start=${origin.longitude},${origin.latitude}&end=${destination.longitude},${destination.latitude}`;
      console.log({ url });
      const res = await fetch(url);
      const json = await res.json();

      if (!json.features || json.features.length === 0) return [];

      const coords = json.features[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        })
      );

      return coords;
    } catch (error) {
      console.error("Route fetch failed:", error);
      return [];
    }
  },

  clearRoute: () => set({ coordinates: [] }),
}));

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[],
  selectedDriver: null,

  setSelectedDriver: (driverId: number) =>
    set(() => ({
      selectedDriver: driverId,
    })),

  setDrivers: (drivers: MarkerData[]) =>
    set(() => ({
      drivers,
    })),

  clearSelectedDriver: () =>
    set(() => ({
      selectedDriver: null,
    })),
}));
