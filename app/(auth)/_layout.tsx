import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { isSignedIn, userId } = useAuth();

  console.log({ isSignedIn, userId });

  if (isSignedIn) {
    return <Redirect href={"/(tabs)"} />;
  }
  return <Slot />;
}
