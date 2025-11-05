import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  const { isSignedIn, userId, isLoaded } = useAuth();

  console.log({ isSignedIn, userId });

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex items-center justify-center h-full">
        <ActivityIndicator size="large" color={"#000"} />
      </SafeAreaView>
    );
  }

  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)"} />;
  }
  return <Slot />;
}
