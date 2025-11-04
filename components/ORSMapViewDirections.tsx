import React, { useEffect, useState } from "react";
import { Polyline } from "react-native-maps";

interface ORSMapViewDirectionsProps {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  strokeColor?: string;
  strokeWidth?: number;
  apiKey: string; // OpenRouteService API key
  profile?: "driving-car" | "cycling-regular" | "foot-walking"; // transport mode
  onReady?: (data: { distance: number; duration: number }) => void;
  onError?: (error: any) => void;
}

/**
 * Drop-in replacement for MapViewDirections using OpenRouteService.
 */
const ORSMapViewDirections: React.FC<ORSMapViewDirectionsProps> = ({
  origin,
  destination,
  strokeColor = "#0286ff",
  strokeWidth = 3,
  apiKey,
  profile = "driving-car",
  onReady,
  onError,
}) => {
  const [coordinates, setCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!origin || !destination) return;

      try {
        const url = `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${apiKey}&start=${origin.longitude},${origin.latitude}&end=${destination.longitude},${destination.latitude}`;
        const res = await fetch(url);
        const json = await res.json();

        if (!json.features || json.features.length === 0)
          throw new Error("No route found");

        const coords = json.features[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lng,
          })
        );

        setCoordinates(coords);

        // Return summary info if callback provided
        if (onReady) {
          const { distance, duration } = json.features[0].properties.summary;
          onReady({ distance, duration });
        }
      } catch (err) {
        console.error("ORS Directions error:", err);
        if (onError) onError(err);
      }
    };

    fetchRoute();
  }, [origin, destination, profile, apiKey]);

  if (!coordinates.length) return null;

  return (
    <Polyline
      coordinates={coordinates}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
    />
  );
};

export default ORSMapViewDirections;
