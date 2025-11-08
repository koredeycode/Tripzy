import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;
  return (
    <SafeAreaView className="flex items-center justify-between h-full px-5 bg-white">
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
        className="flex items-end justify-end w-full p-5"
      >
        <Text className="text-md font-jakarta-bold text-primary-900">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0]"></View>}
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full"></View>
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item, index) => (
          <View key={index} className="flex items-center justify-center p-5">
            <Image
              source={item.image}
              resizeMode="contain"
              className="w-full h-[300px]"
            />
            <View className="flex flex-row justify-center w-full mt-10 item-center">
              <Text className="text-3xl font-bold text-center text-black">
                {item.title}
              </Text>
            </View>
            <Text className="text-md font-jakarta-semibold text-center text-[#858585] mx-10 mt-3">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        className={"w-11/12 mt-10 mb-5"}
      />
    </SafeAreaView>
  );
};

export default Onboarding;
