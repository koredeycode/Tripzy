import ORSMapViewDirections from "@/components/ORSMapViewDirections";
import { icons } from "@/constants";
import { calculateRegion } from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import React from "react";
import { View } from "react-native";
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
  // const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");

  const { userLocation, destinationLocation, tempDestinationLocation } =
    useLocationStore();

  const { drivers, selectedDriver } = useDriverStore();

  const region = calculateRegion({
    userLatitude: userLocation?.latitude!,
    userLongitude: userLocation?.longitude!,
    destinationLatitude: destinationLocation?.latitude!,
    destinationLongitude: destinationLocation?.longitude!,
  });

  // if (loading || !userLocation)
  //   return (
  //     <View className="flex items-center justify-between w-full">
  //       <ActivityIndicator size="small" color={"#000"} />
  //     </View>
  //   );

  // if (error)
  //   return (
  //     <View className="flex items-center justify-between w-full">
  //       <Text>Error: {error}</Text>
  //     </View>
  //   );

  return (
    <View className="relative w-full h-full">
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
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: driver.latitude,
              longitude: driver.longitude,
            }}
            title={driver.title}
            image={
              selectedDriver === driver.id ? icons.selectedMarker : icons.marker
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
      {/* <View className="absolute flex items-center justify-center w-full h-full bg-white/50">
        <ActivityIndicator size={"large"} color={"#000"} />
      </View> */}
    </View>
  );
};

export default Map;
