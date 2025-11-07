import ORSMapViewDirections from "@/components/ORSMapViewDirections";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/type";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_DEFAULT,
} from "react-native-maps";

const Map = ({
  onPress,
}: {
  onPress?: (event: MapPressEvent) => Promise<void>;
}) => {
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");

  const { userLocation, destinationLocation, tempDestinationLocation } =
    useLocationStore();

  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const region = calculateRegion({
    userLatitude: userLocation?.latitude!,
    userLongitude: userLocation?.longitude!,
    destinationLatitude: destinationLocation?.latitude!,
    destinationLongitude: destinationLocation?.longitude!,
  });

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLocation?.latitude || !userLocation.longitude) return;
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude: userLocation.latitude,
        userLongitude: userLocation.longitude,
      });
      setMarkers(newMarkers);
    }
  }, [drivers, userLocation]);

  useEffect(() => {
    console.log(
      markers.length > 0,
      destinationLocation?.latitude,
      destinationLocation?.longitude
    );
    if (
      markers.length > 0 &&
      destinationLocation?.latitude &&
      destinationLocation?.longitude
    ) {
      calculateDriverTimes({
        markers,
        userLatitude: userLocation?.latitude!,
        userLongitude: userLocation?.longitude!,
        destinationLatitude: destinationLocation?.latitude!,
        destinationLongitude: destinationLocation?.longitude!,
      }).then((drivers) => {
        setDrivers(drivers as unknown as MarkerData[]);
      });
    }
    // console.log({ driver: drivers[0] });
  }, [markers, destinationLocation]);

  if (loading || !userLocation)
    return (
      <View className="flex items-center justify-between w-full">
        <ActivityIndicator size="small" color={"#000"} />
      </View>
    );

  if (error)
    return (
      <View className="flex items-center justify-between w-full">
        <Text>Error: {error}</Text>
      </View>
    );

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="flex-1 w-full h-full rounded-2xl"
      tintColor="black"
      mapType="standard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
      style={{ width: "100%", height: "100%" }}
      showsTraffic={true}
      userLocationUpdateInterval={300000 / 5} //1
      onPress={onPress}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}
      {/* {tempDestination && !destinationLocation && (
        <Marker
          key={"selected-destination"}
          coordinate={{
            latitude: tempDestination.latitude,
            longitude: tempDestination.longitude,
          }}
          title="Selected Destination"
        >
          <View className="font-jakarta-extrabold">D</View>
        </Marker>
      )} */}
      {destinationLocation ? (
        <>
          <Marker
            key={"destination"}
            coordinate={
              tempDestinationLocation
                ? {
                    latitude: tempDestinationLocation.latitude,
                    longitude: tempDestinationLocation.longitude,
                  }
                : {
                    latitude: destinationLocation.latitude,
                    longitude: destinationLocation.longitude,
                  }
            }
            title="Destination"
            image={icons.pin}
          />
          {/* <MapViewDirections
            origin={{ latitude: userLatitude, longitude: userLongitude }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            strokeColor="#0286ff"
            strokeWidth={2}
          /> */}
          <ORSMapViewDirections strokeColor="#0286ff" strokeWidth={3} />
        </>
      ) : null}
    </MapView>
  );
};

export default Map;
