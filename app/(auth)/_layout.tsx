import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/(protected)/(tabs)" />;

  return <Slot />;
}
