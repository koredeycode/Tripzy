import RideCard from "@/components/RideCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/type";
import { useUser } from "@clerk/clerk-expo";
import React from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Rides = () => {
  const { user } = useUser();

  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/user/${user?.id}/rides`
  );

  return (
    <SafeAreaView>
      <FlatList
        data={recentRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size={"small"} color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <Text className="my-5 text-2xl font-jakarta-bold">All rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Rides;
