import { images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { PaymentProps } from "@/type";
import { useAuth } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import CustomButton from "./CustomButton";

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    destinationLocation,
    userLocation,
    setDestinationLocation,
    setTempDestinationLocation,
  } = useLocationStore();
  const { userId } = useAuth();

  // Fetch params for the payment sheet
  const fetchPaymentSheetParams = async () => {
    try {
      const { data: res } = await fetchAPI("/stripe/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName || email.split("@")[0],
          email,
          amount,
        }),
      });

      if (!res?.paymentIntent || !res?.ephemeralKey || !res?.customer) {
        throw new Error("Invalid payment initialization response");
      }

      return res;
    } catch (err: any) {
      console.error("Error fetching payment params:", err);
      throw new Error("Failed to initialize payment. Please try again.");
    }
  };

  // Initialize payment sheet
  const initializePaymentSheet = async () => {
    setLoading(true);
    setError(null);

    try {
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Tripzy Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent.client_secret,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: { name: fullName },
        returnURL: "tripzy://book-ride",
      });

      if (initError) {
        console.error("Stripe init error:", initError);
        throw new Error(initError.message || "Failed to initialize payment");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open the payment sheet
  const openPaymentSheet = async () => {
    try {
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert("Payment Error", paymentError.message);
        return;
      }

      // Record the ride if payment succeeds
      await fetchAPI("/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin_address: userLocation?.address,
          destination_address: destinationLocation?.address,
          origin_latitude: userLocation?.latitude,
          origin_longitude: userLocation?.longitude,
          destination_latitude: destinationLocation?.latitude,
          destination_longitude: destinationLocation?.longitude,
          ride_time: rideTime.toFixed(0),
          fare_price: parseInt(amount) * 100,
          payment_status: "paid",
          driver_id: driverId,
          user_id: userId,
        }),
      });

      await setDestinationLocation(null);
      await setTempDestinationLocation(null);

      setSuccess(true);
    } catch (err: any) {
      console.error("Error opening payment sheet:", err);
      Alert.alert("Error", "Something went wrong while processing payment.");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View>
      {/* Loading */}
      {loading && <ActivityIndicator className="my-10" color={"#000"} />}

      {/* Error message */}
      {error && (
        <View className="items-center my-5">
          <Text className="mb-2 text-center text-red-500 font-jakarta-medium">
            {error}
          </Text>
          <CustomButton
            title="Retry"
            onPress={initializePaymentSheet}
            className="w-40"
          />
        </View>
      )}

      {/* Payment button */}
      {!loading && !error && (
        <CustomButton
          title="Confirm Ride"
          className="my-10"
          onPress={openPaymentSheet}
        />
      )}

      {/* Success modal */}
      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="mt-5 w-28 h-28" />
          <Text className="mt-5 text-2xl text-center font-jakarta-bold">
            Ride booked!
          </Text>
          <Text className="mt-3 text-center text-md text-general-200 font-jakarta-medium">
            Thank you for your booking. Your reservation has been placed. Please
            proceed with your trip.
          </Text>
          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              router.push("/(protected)/(tabs)");
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default Payment;
