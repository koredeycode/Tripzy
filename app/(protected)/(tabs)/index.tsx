import CustomButton from "@/components/CustomButton";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import Map from "@/components/Map";
import NomTextInput from "@/components/NomTextInput";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { Location, Ride } from "@/type";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ExpoLocation from "expo-location";
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
import { MapPressEvent } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const {
    userLocation,
    tempDestinationLocation,
    setUserLocation,
    setDestinationLocation,
    setTempDestinationLocation,
  } = useLocationStore();
  const { user } = useUser();
  const { signOut } = useAuth();
  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`
  );

  const [hasPermissions, setHasPermissions] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleMapPress = async (event: MapPressEvent) => {
    console.log("eventAction", event.nativeEvent.action);
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const pressedAddress = await ExpoLocation.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    const locationInfo = pressedAddress[0];

    console.log({ locationInfo });
    await setTempDestinationLocation({
      latitude,
      longitude,
      address:
        locationInfo.formattedAddress ||
        `${locationInfo.name}, ${locationInfo.region}`,
    });
  };

  const handleDestinationPress = async (location: Location) => {
    await setTempDestinationLocation(location);
  };

  const handleStartRide = async () => {
    console.log("start ride start");
    if (!tempDestinationLocation) return;

    await setDestinationLocation(tempDestinationLocation);
    console.log("start ride end");
    router.push(`/(protected)/confirm-ride`);
  };

  const handleResetDestination = async () => {
    await setDestinationLocation(null);
    await setTempDestinationLocation(null);
  };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }
      //ToDo: improve the accuracy here
      let location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: 6,
      });

      console.log({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const address = await ExpoLocation.reverseGeocodeAsync({
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
            {!tempDestinationLocation && (
              <>
                <LocationAutocomplete onSelect={handleDestinationPress} />
                <Text className="mt-5 mb-2 text-md font-jakarta-bold">
                  Or select a specific location on the map
                </Text>
                <View className="flex flex-row items-center justify-center h-[300px]">
                  <Map onPress={handleMapPress} />
                </View>
              </>
            )}
            {/* From–To Section */}
            {userLocation && tempDestinationLocation && (
              <View className="p-4 mt-4 bg-white shadow-md rounded-2xl">
                <View className="my-3">
                  <Text className="mb-3 text-lg font-jakarta-semibold">
                    From
                  </Text>
                  <NomTextInput
                    handlePress={() => {}}
                    icon={icons.target}
                    initialLocation={userLocation?.address}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="#f5f5f5"
                  />
                </View>

                <View className="my-3">
                  <Text className="mb-3 text-lg font-jakarta-semibold">To</Text>
                  <NomTextInput
                    // handlePress={(location) => setDestinationLocation(location)}
                    handlePress={() => {}}
                    icon={icons.map}
                    initialLocation={
                      tempDestinationLocation
                        ? tempDestinationLocation?.address
                        : "Select Destination Address"
                    }
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="transparent"
                  />
                </View>
                <CustomButton title="Start Ride" onPress={handleStartRide} />
                <CustomButton
                  title="Cancel"
                  onPress={handleResetDestination}
                  className="mt-3 bg-neutral-400"
                  textStyles="text-black"
                />
              </View>
            )}
            <Text className="mt-5 text-xl font-jakarta-bold">Recent Rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
}
