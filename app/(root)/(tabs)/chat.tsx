import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { chatConversations, chatMessages, icons, images } from "@/constants";

const Chat = () => {
  const conversations = useMemo(() => {
    return chatConversations.map((c) => {
      const msgs = chatMessages[c.id] || [];
      const last = msgs[msgs.length - 1];
      return {
        ...c,
        lastMessage: last ? last.text : "No messages yet",
        time: last ? last.timestamp : c.time || "",
      };
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 110, paddingHorizontal: 20 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={() => (
          <Text className="my-5 text-2xl font-jakarta-bold">Chats</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: {
                  id: item.id,
                  name: item.name,
                  avatar: item.avatar || "",
                },
              })
            }
            className="flex flex-row items-center p-3 mb-3 bg-white shadow-sm rounded-xl shadow-neutral-300"
          >
            <Image
              source={item.avatar ? { uri: item.avatar } : icons.person}
              className="w-12 h-12 mr-3 rounded-full"
            />
            <View className="flex-1">
              <View className="flex flex-row items-center justify-between">
                <Text
                  className="text-base font-jakarta-semibold"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text className="ml-2 text-xs text-gray-500 font-jakarta">
                  {item.time}
                </Text>
              </View>
              <Text className="mt-1 text-sm text-gray-600" numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View className="flex items-center justify-center flex-1">
            <Image
              source={images.message}
              alt="message"
              className="w-full h-40"
              resizeMode="contain"
            />
            <Text className="mt-3 text-3xl font-jakarta-bold">
              No Messages Yet
            </Text>
            <Text className="mt-2 text-base text-center px-7">
              Book a ride and start a conversation with drivers.
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Chat;
