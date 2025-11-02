import { icons } from "@/constants";
import React from "react";
import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

const OAuth = () => {
  const handleGoogleSignIn = async () => {};
  return (
    <View>
      <View className="flex flex-row items-center justify-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg"> Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>
      <CustomButton
        title="Login in with Google"
        className="w-full mt-5 shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
