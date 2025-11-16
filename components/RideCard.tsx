import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { ExtraConfig, Ride } from "@/type";
import cn from "clsx";
import Constants from "expo-constants";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const RideCard = ({
  ride: {
    destination_latitude,
    destination_longitude,
    destination_address,
    created_at,
    ride_time,
    origin_address,
    driver,
    payment_status,
    ride_id,
  },
}: {
  ride: Ride;
}) => {
  const { geoapifyApiKey } = Constants.expoConfig?.extra as ExtraConfig;
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(protected)/ride/${ride_id}`)}
      className="flex flex-row items-center justify-center mb-3 bg-white rounded-lg shadow-sm shadow-neutral-300"
    >
      <View className="flex flex-col items-start justify-center p-3">
        <View className="flex flex-row items-center justify-between">
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${geoapifyApiKey}`,
            }}
            className="w-[80px] h-[90px] rounded-lg"
          />
          <View className="flex flex-col flex-1 mx-5 gap-y-5">
            <View className="flex flex-row item-center gap-x-2">
              <Image source={icons.to} className="w-5 h-5" />
              <Text className="text-md font-jakarta-medium" numberOfLines={1}>
                {origin_address}
              </Text>
            </View>
            <View className="flex flex-row item-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-md font-jakarta-medium" numberOfLines={1}>
                {destination_address}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex flex-col items-start justify-center w-full p-3 mt-5 rounded-lg bg-general-500">
          <View className="flex flex-row items-center justify-between w-full mb-5">
            <Text className="text-gray-500 text-md font-jakarta-medium">
              Date & Time
            </Text>
            <Text className="text-gray-500 text-md font-jakarta-medium">
              {formatDate(created_at)},{formatTime(ride_time)}
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between w-full mb-5">
            <Text className="text-gray-500 text-md font-jakarta-medium">
              Driver
            </Text>
            <Text className="text-gray-500 text-md font-jakarta-medium">
              {driver.first_name} {driver.last_name}
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between w-full mb-5">
            <Text className="text-gray-500 text-md font-jakarta-medium">
              Car Seats
            </Text>
            <Text className="text-gray-500 text-md font-jakarta-medium">
              {driver.car_seats}
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between w-full mb-5">
            <Text className="text-gray-500 text-md font-jakarta-medium">
              Payment Status
            </Text>
            <Text
              className={cn(
                "text-gray-500 capitalize text-md font-jakarta-medium",
                payment_status === "paid" ? "text-green-500" : "text-red-500"
              )}
            >
              {payment_status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RideCard;
