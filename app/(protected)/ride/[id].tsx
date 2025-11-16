import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { formatDate, formatTime } from "@/lib/utils";
import { ExtraConfig, Ride } from "@/type";
import cn from "clsx";
import Constants from "expo-constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RideDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { geoapifyApiKey } = Constants.expoConfig?.extra as ExtraConfig;

  const { data: ride, loading } = useFetch<Ride>(`/rides/${id}`);

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!ride) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <Text className="text-lg text-gray-500">Ride not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="flex flex-row items-center mb-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 mr-3 bg-gray-100 rounded-full"
          >
            <Image
              source={icons.backArrow}
              className="w-5 h-5"
              tintColor="#000"
            />
          </TouchableOpacity>
          <Text className="text-2xl font-jakarta-bold">Ride Details</Text>
        </View>

        {/* Map Snapshot */}
        <Image
          source={{
            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=800&height=400&center=lonlat:${ride.destination_longitude},${ride.destination_latitude}&zoom=13&apiKey=${geoapifyApiKey}`,
          }}
          className="w-full mb-5 h-52 rounded-xl"
          resizeMode="cover"
        />

        {/* Route Info */}
        <View className="flex flex-col mb-6 gap-y-3">
          <View className="flex flex-row items-center gap-x-2">
            <Image source={icons.to} className="w-5 h-5" />
            <Text className="text-base font-jakarta-medium" numberOfLines={2}>
              {ride.origin_address}
            </Text>
          </View>

          <View className="flex flex-row items-center gap-x-2">
            <Image source={icons.point} className="w-5 h-5" />
            <Text className="text-base font-jakarta-medium" numberOfLines={2}>
              {ride.destination_address}
            </Text>
          </View>
        </View>

        {/* Ride Info Card */}
        <View className="p-4 rounded-lg shadow-sm bg-general-500 shadow-neutral-300">
          <DetailRow
            label="Date & Time"
            value={`${formatDate(ride.created_at)}, ${formatTime(ride.ride_time)}`}
          />
          <DetailRow
            label="Driver"
            value={`${ride.driver.first_name} ${ride.driver.last_name}`}
          />
          <DetailRow label="Car Seats" value={`${ride.driver.car_seats}`} />
          <DetailRow
            label="Payment Status"
            value={ride.payment_status}
            valueClass={cn(
              "capitalize",
              ride.payment_status === "paid" ? "text-green-500" : "text-red-500"
            )}
          />
        </View>

        {/* Optionally: Add more info */}
        <View className="mt-6">
          <Text className="text-sm text-gray-600">
            Thank you for choosing our service! We hope you enjoyed your ride.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <View className="flex flex-row items-center justify-between py-3 border-b border-gray-200">
    <Text className="text-gray-500 text-md font-jakarta-medium">{label}</Text>
    <Text
      className={cn("text-gray-600 text-md font-jakarta-medium", valueClass)}
    >
      {value}
    </Text>
  </View>
);

export default RideDetail;
