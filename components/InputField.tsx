import { InputFieldProps } from "@/type";
import cn from "clsx";
import React from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const InputField = ({
  label,
  labelStyle,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-full my-2">
          <Text
            className={cn("text-lg font-jakarta-semibold mb-3", labelStyle)}
          >
            {label}
          </Text>
          <View
            className={cn(
              "flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500",
              containerStyle
            )}
          >
            {icon && (
              <Image source={icon} className={cn("w-6 h-6 ml-4", iconStyle)} />
            )}
            <TextInput
              className={cn(
                "rounded-full p-4 font-jakarta-semibold flex-1 text-[15px]",
                inputStyle,
                "text-left"
              )}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
