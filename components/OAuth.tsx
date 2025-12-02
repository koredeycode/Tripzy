import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

const OAuth = () => {
  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const handleGoogleSignIn = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      console.log({
        redirectUri: AuthSession.makeRedirectUri({
          scheme: "tripzy",
          path: "/sign-in",
        }),
      });
      const { createdSessionId, setActive, signUp } = await startSSOFlow({
        strategy: "oauth_google",
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "tripzy",
          path: "/sign-in",
        }),
      });

      // If sign in was successful, set the active session
      if (createdSessionId && setActive) {
        console.log("createdsession id and setactive found");
        console.log({ createdSessionId, signUp });
        await setActive({
          session: createdSessionId,
          // Check for session tasks and navigate to custom UI to help users resolve them
          // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              router.push("/sign-in");
              return;
            }
            router.replace("/(protected)/(tabs)");
          },
        });

        if (signUp?.createdUserId) {
          console.log("created user id");
          await fetchAPI("/auth/signup", {
            method: "POST",
            body: JSON.stringify({
              first_name: signUp.firstName,
              last_name: signUp.lastName,
              email: signUp.emailAddress,
              clerk_id: signUp.createdUserId,
            }),
          });
        } else {
          console.log("no created signup.createduseid", signUp);
        }
      } else {
        console.log("no createdsession id");
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow]);

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
