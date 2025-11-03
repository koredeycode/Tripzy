import { GoogleInputProps } from "@/type";
import cn from "clsx";
import React from "react";
import { View } from "react-native";
import LocationAutocomplete from "./LocationAutocomplete";

const NomTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  return (
    <View
      className={cn(
        "flex flex-row items-center justify-center relative z-50 rounded-xl",
        containerStyle,
        "mb-5"
      )}
    >
      <LocationAutocomplete
        icon={icon}
        initialLocation={initialLocation}
        onSelect={handlePress}
        textInputBackgroundColor={textInputBackgroundColor}
      />
    </View>
  );
};

export default NomTextInput;
