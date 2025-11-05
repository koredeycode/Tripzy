import { chatMessages, icons, images } from "@/constants";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: string;
}

export default function ChatThread() {
  const { id, name, avatar } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const lastMsg = (chatMessages[id!] || []).slice(-1)[0] as Message | undefined;
  const lastSeen = lastMsg?.timestamp
    ? `last seen ${lastMsg.timestamp}`
    : "online";
  const [messages, setMessages] = useState<Message[]>(
    (chatMessages[id!] as Message[] | undefined) || []
  );
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  const send = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Math.random().toString(36).slice(2),
      text: input.trim(),
      fromMe: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    requestAnimationFrame(() =>
      listRef.current?.scrollToEnd({ animated: true })
    );
  };

  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        router.replace("/(root)/(tabs)/chat");
        return true;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }, [])
  );

  const renderItem = ({ item }: { item: Message }) => (
    <View className={`my-1 w-full px-3`}>
      <View
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          item.fromMe
            ? "bg-general-400 self-end rounded-br-md"
            : "bg-white self-start rounded-bl-md shadow-sm shadow-neutral-300"
        }`}
      >
        <Text
          className={`${item.fromMe ? "text-white" : "text-black"} font-jakarta`}
        >
          {item.text}
        </Text>
        <Text
          className={`mt-1 text-[10px] ${item.fromMe ? "text-white/70" : "text-gray-500"}`}
        >
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {menuOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
          className="absolute inset-0 z-10"
        />
      )}
      <View className="relative flex flex-row items-center justify-between px-4 py-3 border-b border-neutral-200">
        <View className="flex flex-row items-center">
          <TouchableOpacity
            onPress={() => router.replace("/(root)/(tabs)/chat")}
            className="mr-3"
          >
            <View className="items-center justify-center w-10 h-10 bg-white rounded-full">
              <Image
                source={icons.backArrow}
                className="w-6 h-6"
                resizeMode="contain"
                tintColor={"#000"}
              />
            </View>
          </TouchableOpacity>
          <Image
            source={avatar ? { uri: String(avatar) } : icons.person}
            className="mr-3 rounded-full w-9 h-9"
          />
          <View>
            <Text className="text-base font-jakarta-semibold" numberOfLines={1}>
              {name || "Conversation"}
            </Text>
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {lastSeen}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center">
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Call", `Calling ${name || "driver"}...`)
            }
            className="items-center justify-center mr-2 bg-white rounded-full shadow-sm w-9 h-9 shadow-neutral-300"
          >
            <View className="items-center justify-center w-10 h-10 bg-white rounded-full">
              <Image
                source={icons.phone}
                className="w-6 h-6"
                resizeMode="contain"
                tintColor={"#000"}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMenuOpen((v) => !v)}
            className="items-center justify-center bg-white rounded-full shadow-sm w-9 h-9 shadow-neutral-300"
          >
            <View className="items-center justify-center w-10 h-10 bg-white rounded-full">
              <Image
                source={icons.ellipsis}
                className="w-7 h-7"
                resizeMode="contain"
                tintColor={"#000"}
              />
            </View>
          </TouchableOpacity>
          {menuOpen && (
            <View className="absolute right-0 z-20 w-40 p-1 bg-white rounded-lg shadow-lg top-14 shadow-neutral-400">
              <TouchableOpacity
                className="px-3 py-4 rounded-md hover:bg-neutral-100"
                onPress={() => {
                  setMenuOpen(false);
                  router.push({ pathname: "/(root)/(tabs)/profile" });
                }}
              >
                <Text className="text-md font-jakarta">View profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-3 py-4 rounded-md hover:bg-neutral-100"
                onPress={() => {
                  setMenuOpen(false);
                  Alert.alert("Report", "Thanks, we\'ll review this chat.");
                }}
              >
                <Text className="text-md font-jakarta">Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-3 py-4 rounded-md hover:bg-neutral-100"
                onPress={() => {
                  setMenuOpen(false);
                  Alert.alert(
                    "Blocked",
                    "You will no longer receive messages."
                  );
                }}
              >
                <Text className="text-red-500 text-md font-jakarta">Block</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 8 }}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: false })
        }
        ListEmptyComponent={() => (
          <View className="flex items-center justify-center py-16">
            <Image
              source={images.message}
              className="w-40 h-40"
              resizeMode="contain"
            />
            <Text className="mt-3 text-xl font-jakarta-semibold">
              No messages yet
            </Text>
            <Text className="mt-1 text-gray-600">
              Say hello to start the conversation.
            </Text>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
      >
        <View className="flex flex-row items-center px-4 py-3 m-4 bg-white rounded-full shadow-sm shadow-neutral-300">
          <TextInput
            placeholder="Type a message"
            className="flex-1 px-3 py-2 font-jakarta"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={send}
            className="items-center justify-center w-10 h-10 rounded-full bg-general-400"
          >
            <Image source={icons.chat} className="w-7 h-7" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
