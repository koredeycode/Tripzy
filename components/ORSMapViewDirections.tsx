import { useLocationStore } from "@/store";
import React from "react";
import { Polyline } from "react-native-maps";

interface ORSMapViewDirectionsProps {
  strokeColor?: string;
  strokeWidth?: number;
}

const ORSMapViewDirections: React.FC<ORSMapViewDirectionsProps> = ({
  strokeColor = "#0286ff",
  strokeWidth = 3,
}) => {
  const coordinates = useLocationStore((state) => state.coordinates);

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
