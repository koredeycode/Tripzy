import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const { isSignedIn, userId, isLoaded } = useAuth();

  console.log({ isSignedIn, userId });

  if (!isLoaded) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" color={"#000"} />
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }
  return <Slot />;
}
