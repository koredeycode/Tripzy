import {
  DriverStore,
  ExtraConfig,
  Location,
  LocationStore,
  MarkerData,
} from "@/type";
import Constants from "expo-constants";
import { create } from "zustand";

const { orsApiKey } = Constants.expoConfig?.extra as ExtraConfig;

export const useLocationStore = create<LocationStore>((set, get) => ({
  destinationLocation: null,
  tempDestinationLocation: null,
  userLocation: null,

  coordinates: [],

  setUserLocation: (location: Location) => {
    set({
      userLocation: location,
    });
  },

  setTempDestinationLocation: async (location) => {
    if (!location) {
      set({ tempDestinationLocation: null });
      return;
    }
    const { userLocation, fetchRoute } = get();

    set({ tempDestinationLocation: location });
    if (userLocation?.latitude && userLocation?.longitude) {
      // const apiKey = process.env.EXPO_PUBLIC_ORS_API_KEY!;
      const route = await fetchRoute(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: location.latitude, longitude: location.longitude },
        orsApiKey
      );

      set({ coordinates: route });
    }
  },

  setDestinationLocation: async (location) => {
    if (!location) {
      set({ destinationLocation: null });
      return;
    }
    const { userLocation, fetchRoute } = get();

    set({ destinationLocation: location });
    if (userLocation?.latitude && userLocation?.longitude) {
      // const apiKey = process.env.EXPO_PUBLIC_ORS_API_KEY!;
      const route = await fetchRoute(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: location.latitude, longitude: location.longitude },
        orsApiKey
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
