import { Slot } from "expo-router";
import React from "react";

export default function ProtectedLayout() {
  // const { isLoaded, isSignedIn } = useAuth();

  // if (!isLoaded) {
  //   return (
  //     <SafeAreaView className="flex items-center justify-center h-full">
  //       <ActivityIndicator size="large" color="#000" />
  //     </SafeAreaView>
  //   );
  // }

  // if (!isSignedIn) {
  //   return <Redirect href="/(auth)/sign-in" />;
  // }

  return <Slot />;
}
