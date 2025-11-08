import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user } = useUser();

  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await user?.update({
        firstName,
        lastName,
      });
      // TODO: Create a database user
      await fetchAPI("/(api)/user", {
        method: "PUT",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,

          clerkId: user?.id,
        }),
      });
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
      setEditable(false);
    }
  };
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="my-5 text-2xl font-jakarta-bold">Your profile</Text>

        <View className="flex items-center justify-center my-5">
          <View className="relative">
            <Image
              source={{
                uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
              }}
              style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
              className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
            />
            <TouchableOpacity
              className="absolute bottom-0 p-2 bg-white rounded-full shadow-md right-2"
              onPress={() => setEditable((prev) => !prev)}
            >
              <Pencil size={18} color="#111" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-col items-start justify-center px-5 py-3 bg-white rounded-lg shadow-sm shadow-neutral-300">
          <View className="flex flex-col items-start justify-start w-full">
            <InputField
              label="First name"
              placeholder={user?.firstName || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={editable}
              value={firstName}
              onChangeText={setFirstName}
            />

            <InputField
              label="Last name"
              placeholder={user?.lastName || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={editable}
              value={lastName}
              onChangeText={setLastName}
            />

            <InputField
              label="Email"
              placeholder={
                user?.primaryEmailAddress?.emailAddress || "Not Found"
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Phone"
              placeholder={user?.primaryPhoneNumber?.phoneNumber || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />
          </View>
        </View>

        <View className="mt-5">
          <CustomButton
            disabled={loading || !editable}
            title="Update Profile"
            onPress={handleUpdate}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
