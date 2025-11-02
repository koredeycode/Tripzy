import { router } from "expo-router";
import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  return (
    <SafeAreaView className="flex flex-col gap-y-4">
      <Text>SignUp</Text>
      <Button title="Sign In" onPress={() => router.push("/sign-in")} />
      <Button title="Onboarding" onPress={() => router.push("/onboarding")} />
    </SafeAreaView>
  );
};

export default SignUp;
