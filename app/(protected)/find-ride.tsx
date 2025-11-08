import CustomButton from "@/components/CustomButton";
import NomTextInput from "@/components/NomTextInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const FindRide = () => {
  const {
    userLocation,
    destinationLocation,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <RideLayout title="Ride" snapPoints={["85%"]}>
      <View className="my-3">
        <Text className="mb-3 text-lg font-jakarta-semibold">From</Text>
        <NomTextInput
          handlePress={(location) => setUserLocation(location)}
          icon={icons.target}
          initialLocation={userLocation?.address}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
        />
      </View>
      <View className="my-3">
        <Text className="mb-3 text-lg font-jakarta-semibold">To</Text>
        <NomTextInput
          handlePress={(location) => setDestinationLocation(location)}
          icon={icons.map}
          initialLocation={destinationLocation?.address}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
        />
      </View>
      <CustomButton
        title="Find now"
        onPress={() => router.push("/(protected)/confirm-ride")}
        className="mt-5"
      />
    </RideLayout>
  );
};

export default FindRide;
