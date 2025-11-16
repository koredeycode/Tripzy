import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,

    name: "Tripzy",
    slug: "Tripzy",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "tripzy",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.korecodes.Tripzy",
    },

    android: {
      package: "com.korecodes.Tripzy",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/icon.png",
        backgroundImage: "./assets/images/icon.png",
        monochromeImage: "./assets/images/icon.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      softwareKeyboardLayoutMode: "resize",
    },

    plugins: [
      [
        "expo-router",
        {
          origin: "https://tripzy.com/",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/PlusJakartaSans-Bold.ttf",
            "./assets/fonts/PlusJakartaSans-ExtraBold.ttf",
            "./assets/fonts/PlusJakartaSans-ExtraLight.ttf",
            "./assets/fonts/PlusJakartaSans-Light.ttf",
            "./assets/fonts/PlusJakartaSans-Medium.ttf",
            "./assets/fonts/PlusJakartaSans-Regular.ttf",
            "./assets/fonts/PlusJakartaSans-SemiBold.ttf",
          ],
        },
      ],
      "expo-web-browser",
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      // router config
      router: {
        origin: "https://tripzy.com/",
      },

      // EAS config (kept from app.json)
      eas: {
        projectId: "72273dc2-fa16-4793-993e-2b7fdd6e82c3",
      },

      // environment variables (your old app.config.js)
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      serverUrl: process.env.EXPO_PUBLIC_SERVER_URL,
      geoapifyApiKey: process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY,
      googleApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      orsApiKey: process.env.EXPO_PUBLIC_ORS_API_KEY,
    },
  };
};
