import LocationAutocomplete from "@/components/LocationAutocomplete";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { Ride } from "@/type";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();
  const { signOut } = useAuth();
  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`
  );

  const [hasPermissions, setHasPermissions] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(root)/(auth)/sign-in");
  };

  const handleDestinationPress = async (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    await setDestinationLocation(location);

    router.push(`/(root)/find-ride`);
  };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync();

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address:
          address[0].formattedAddress ||
          `${address[0].name}, ${address[0].region}`,
      });
    };
    requestLocation();
  }, []);
  return (
    <SafeAreaView className="">
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
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl capitalize font-jakarta-extrabold">
                Welcome {user?.firstName} 👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="items-center justify-center w-10 h-10 bg-white rounded-full"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>
            {/* <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            /> */}
            <LocationAutocomplete onSelect={handleDestinationPress} />
            <>
              <Text className="mt-5 text-xl font-jakarta-bold">
                Your Current Location
              </Text>
              <View className="flex flex-row items-center justify-center h-[300px]">
                <Map />
              </View>
            </>
            <Text className="mt-5 text-xl font-jakarta-bold">Recent Rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
}
