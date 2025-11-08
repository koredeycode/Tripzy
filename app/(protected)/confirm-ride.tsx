import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useFetch } from "@/lib/fetch";
import { calculateDriverTimes, generateMarkersFromData } from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/type";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";

const ConfirmRide = () => {
  const {
    data: driverList,
    loading,
    error,
  } = useFetch<Driver[]>("/(api)/driver");

  const { userLocation, destinationLocation, tempDestinationLocation } =
    useLocationStore();
  const { drivers, setDrivers, selectedDriver, setSelectedDriver } =
    useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    if (Array.isArray(driverList)) {
      if (!userLocation?.latitude || !userLocation.longitude) return;
      const newMarkers = generateMarkersFromData({
        data: driverList,
        userLatitude: userLocation.latitude,
        userLongitude: userLocation.longitude,
      });
      setMarkers(newMarkers);
    }
  }, [driverList, userLocation]);

  useEffect(() => {
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
  }, [markers, destinationLocation]);

  if (loading)
    return (
      <View className="flex items-center justify-center w-full h-full bg-white">
        <ActivityIndicator size="large" color={"#000"} />
      </View>
    );

  if (error)
    return (
      <View className="flex items-center justify-between w-full">
        <Text>Error: {error}</Text>
      </View>
    );

  return (
    <RideLayout title="Choose a Driver" snapPoints={["65%", "85%"]}>
      <FlatList
        data={drivers}
        renderItem={({ item }) => (
          <DriverCard
            setSelected={() => setSelectedDriver(item.id)}
            selected={selectedDriver!}
            item={item}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            {loading && <Text>Loading drivers</Text>}
            <CustomButton
              title="Select Ride"
              onPress={() => {
                if (!selectedDriver) {
                  Alert.alert("Error", "Please select a driver.");
                  return;
                }
                router.push("/(protected)/book-ride");
              }}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
