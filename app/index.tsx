import React from "react";

import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <>
      <SignedIn>
        <Redirect href="/(protected)/(tabs)" />
      </SignedIn>

      <SignedOut>
        {/* <View className="justify-center flex-1 px-6 bg-gray-50">
          <View className="w-full max-w-sm mx-auto">
            <Text className="mb-2 text-3xl font-bold text-center text-gray-900">
              Welcome to
            </Text>
            <Text className="mb-8 text-4xl font-bold text-center text-black">
              Tripzy
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/(protected)/(tabs)" as any)}
              className="items-center py-4 mb-4 bg-black rounded-lg"
            >
              <Text className="font-semibold text-white">Welcome</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-in")}
              className="items-center py-4 mb-4 bg-black rounded-lg"
            >
              <Text className="font-semibold text-white">Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-up")}
              className="items-center py-4 border border-black rounded-lg"
            >
              <Text className="font-semibold">Create Account</Text>
            </TouchableOpacity>
          </View>
        </View> */}
        <Redirect href="/(auth)/sign-in" />
      </SignedOut>
    </>
  );
}
