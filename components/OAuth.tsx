import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSSO, useUser } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

const OAuth = () => {
  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();
  const { user } = useUser();

  // Automatically save user once logged in
  useEffect(() => {
    if (user) {
      const saveUserToDB = async () => {
        console.log({ user });
        try {
          // TODO: Create a database user
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${user.firstName} ${user.lastName}`,
              email: user.primaryEmailAddress,
              clerkId: user.id,
            }),
          });
          console.log("User saved successfully!");
        } catch (err) {
          console.error("Error saving user:", err);
        }
      };

      saveUserToDB();
    }
  }, [user]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        console.log({ createdSessionId, signUp });
        setActive!({
          session: createdSessionId,
          // Check for session tasks and navigate to custom UI to help users resolve them
          // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              router.push("/sign-in");
              return;
            }

            router.push("/");
          },
        });
        if (signUp?.createdUserId) {
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${signUp.firstName} ${signUp.lastName}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
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
  }, []);

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
