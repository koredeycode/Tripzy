/* eslint-disable react/no-unescaped-entities */
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName: form.first_name,
        lastName: form.last_name,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        // TODO: Create a database user
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          }),
        });
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ ...verification, state: "success" });
        router.replace("/(root)/(auth)/sign-in");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setVerification({
          ...verification,
          error: "Verification failed",
          state: "failed",
        });
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[200px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[200px]" />
          <Text className="absolute text-2xl text-black font-jakarta-semibold bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label={"First Name"}
            placeholder="Enter your first name"
            icon={icons.person}
            value={form.first_name}
            onChangeText={(value) => {
              setForm({ ...form, first_name: value });
            }}
          />
          <InputField
            label={"Last Name"}
            placeholder="Enter your last name"
            icon={icons.person}
            value={form.last_name}
            onChangeText={(value) => {
              setForm({ ...form, last_name: value });
            }}
          />
          <InputField
            label={"Email"}
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => {
              setForm({ ...form, email: value });
            }}
          />
          <InputField
            label={"Password"}
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => {
              setForm({ ...form, password: value });
            }}
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />
          {/* OAuth */}
          <OAuth />

          <Link
            href="/(root)/(auth)/sign-in"
            className="mt-5 text-lg text-center text-general-200"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
        {/* Verification modal */}

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            // setVerification({ ...verification, state: "success" })
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="mb-2 text-2xl font-jakarta-extrabold">
              Verification
            </Text>
            <Text className="mb-5 font-jakarta">
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="123456"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="mt-1 text-sm text-red-500">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              className="mt-4 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl text-center font-jakarta-bold">
              Verified
            </Text>
            <Text className="mt-2 text-base text-center text-gray-400 font-jakarta">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/(root)/(auth)/sign-in");
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
{
  /* <Text>SignUp</Text>
<Button title="Sign In" onPress={() => router.push("/sign-in")} />
<Button title="Onboarding" onPress={() => router.push("/onboarding")} /> */
}
