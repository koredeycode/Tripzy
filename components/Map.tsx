import React from "react";
import { Text } from "react-native";
import MapView from "react-native-maps";

const Map = () => {
  return (
    // <MapView provider={PROVIDER_DEFAULT} className="w-full h-full rounded-2xl">
    // </MapView>
    <>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <Text>Map</Text>
    </>
  );
};

export default Map;
