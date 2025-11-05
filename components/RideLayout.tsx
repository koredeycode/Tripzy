import { icons } from "@/constants";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Map from "./Map";

const RideLayout = ({
  title,
  children,
  snapPoints,
}: {
  title?: string;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-white">
        <View className="flex flex-col h-screen bg-blue-500">
          <View className="absolute z-10 flex flex-row items-center justify-start w-full px-5 py-3 top-16 bg-black/50">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="items-center justify-center w-10 h-10 bg-white rounded-full">
                <Image
                  className="w-6 h-6"
                  resizeMode="contain"
                  source={icons.backArrow}
                />
              </View>
            </TouchableOpacity>
            <Text className="ml-5 text-xl text-white font-jakarta-semibold">
              {title || "Go back"}
            </Text>
          </View>
          <Map />
        </View>
        <BottomSheet
          keyboardBehavior="extend"
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["40%", "85%"]}
          index={0}
        >
          <BottomSheetView style={{ flex: 1, padding: 20 }}>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
