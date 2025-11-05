import { useUser } from "@clerk/clerk-expo";
import { Image, Text, View } from "react-native";

import Payment from "@/components/Payment";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";

import { StripeProvider } from "@stripe/stripe-react-native";

const BookRide = () => {
  const { user } = useUser();
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.filter(
    (driver) => +driver.id === selectedDriver
  )[0];

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.tripzy.com" // required for Apple Pay
      urlScheme="tripzy" // required for 3D Secure and bank redirects
    >
      <RideLayout title="Book Ride">
        <>
          <Text className="mb-3 text-xl font-jakarta-semibold">
            Ride Information
          </Text>

          <View className="flex flex-col items-center justify-center w-full mt-10">
            <View className="relative">
              <Image
                source={{ uri: driverDetails?.profile_image_url }}
                className="rounded-full w-28 h-28"
              />

              {/* Rating Badge */}
              <View className="absolute bottom-0 flex flex-row items-center px-2 py-1 rounded-full -right-8 bg-black/70">
                <Image
                  source={icons.star}
                  className="w-4 h-4 mr-1"
                  resizeMode="contain"
                />
                <Text className="text-sm text-white font-jakarta-semibold">
                  {driverDetails?.rating}
                </Text>
              </View>
            </View>

            <Text className="mt-5 text-lg font-jakarta-semibold">
              {driverDetails?.title}
            </Text>
          </View>

          <View className="flex flex-col items-start justify-center w-full px-5 py-3 mt-5 rounded-3xl bg-general-600">
            <View className="flex flex-row items-center justify-between w-full py-3 border-b border-white">
              <Text className="text-lg font-jakarta">Ride Price</Text>
              <Text className="text-lg font-jakarta text-[#0CC25F]">
                ${driverDetails?.price}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full py-3 border-b border-white">
              <Text className="text-lg font-jakarta">Pickup Time</Text>
              <Text className="text-lg font-jakarta">
                {formatTime(driverDetails?.time!)}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full py-3">
              <Text className="text-lg font-jakarta">Car Seats</Text>
              <Text className="text-lg font-jakarta">
                {driverDetails?.car_seats}
              </Text>
            </View>
          </View>

          <View className="flex flex-col items-start justify-center w-full mt-5">
            <View className="flex flex-row items-center justify-start w-full py-3 mt-3 border-t border-b border-general-700">
              <Image source={icons.to} className="w-6 h-6" />
              <Text className="ml-2 text-lg font-jakarta">{userAddress}</Text>
            </View>

            <View className="flex flex-row items-center justify-start w-full py-3 border-b border-general-700">
              <Image source={icons.point} className="w-6 h-6" />
              <Text className="ml-2 text-lg font-jakarta">
                {destinationAddress}
              </Text>
            </View>
          </View>
          <Payment
            fullName={user?.fullName!}
            email={user?.emailAddresses[0].emailAddress!}
            amount={driverDetails?.price!}
            driverId={driverDetails?.id}
            rideTime={driverDetails?.time!}
          />
        </>
      </RideLayout>
    </StripeProvider>
  );
};

export default BookRide;
