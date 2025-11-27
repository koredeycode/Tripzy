import { chatMessages, icons, images } from "@/constants";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, MoreVertical, Phone } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Bubble,
  BubbleProps,
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  SendProps,
} from "react-native-gifted-chat";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ChatThread() {
  const { id, name, avatar } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const initialMessages = (chatMessages[id!] || []).map((msg: any) => ({
      _id: msg.id,
      text: msg.text,
      createdAt: new Date(), // In a real app, parse msg.timestamp
      user: {
        _id: msg.fromMe ? 1 : 2,
        name: msg.fromMe ? "Me" : name || "User",
        avatar: msg.fromMe ? undefined : String(avatar),
      },
    }));
    setMessages(initialMessages.reverse());
  }, [id, name, avatar]);

  const lastMsg = (chatMessages[id!] || []).slice(-1)[0];
  const lastSeen = lastMsg?.timestamp
    ? `last seen ${lastMsg.timestamp}`
    : "online";

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        router.replace("/(protected)/(tabs)/chat");
        return true;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }, [])
  );

  const renderBubble = (props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#0CC25F",
            borderBottomRightRadius: 6,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            marginBottom: 4,
            paddingHorizontal: 4,
            paddingVertical: 2,
          },
          left: {
            backgroundColor: "white",
            borderBottomLeftRadius: 6,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginBottom: 4,
            paddingHorizontal: 4,
            paddingVertical: 2,
            shadowColor: "#d4d4d4",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          },
        }}
        textStyle={{
          right: {
            color: "white",
            fontFamily: "Jakarta-Regular",
          },
          left: {
            color: "black",
            fontFamily: "Jakarta-Regular",
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderTopWidth: 0,
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginBottom: Platform.OS === "ios" ? 0 : 10,
        }}
        primaryStyle={{
          backgroundColor: "white",
          borderRadius: 9999,
          shadowColor: "#d4d4d4",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
          alignItems: "center",
          paddingRight: 8,
        }}
      />
    );
  };

  const renderSend = (props: SendProps<IMessage>) => {
    const { text, onSend } = props;
    return (
      <TouchableOpacity
        onPress={() => {
          if (text && onSend) {
            onSend({ text: text.trim() } as any, true);
          }
        }}
        className="items-center self-center justify-center w-10 h-10 mr-1 rounded-full bg-general-400"
      >
        <Image source={icons.chat} className="w-7 h-7" resizeMode="contain" />
      </TouchableOpacity>
    );
  };

  const renderChatEmpty = () => {
    return (
      <View className="flex items-center justify-center py-16 transform scale-x-[-1] scale-y-[-1]">
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
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
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
            onPress={() => router.replace("/(protected)/(tabs)/chat")}
            className="mr-3"
          >
            <ArrowLeft size={24} color="#000" />
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
            <Phone size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMenuOpen((v) => !v)}
            className="items-center justify-center bg-white rounded-full shadow-sm w-9 h-9 shadow-neutral-300"
          >
            <MoreVertical size={26} color="#000" />
          </TouchableOpacity>
          {menuOpen && (
            <View className="absolute right-0 z-20 w-40 p-1 bg-white rounded-lg shadow-lg top-14 shadow-neutral-400">
              <TouchableOpacity
                className="px-3 py-4 rounded-md hover:bg-neutral-100"
                onPress={() => {
                  setMenuOpen(false);
                  router.push({ pathname: "/(protected)/(tabs)/profile" });
                }}
              >
                <Text className="text-md font-jakarta">View profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-3 py-4 rounded-md hover:bg-neutral-100"
                onPress={() => {
                  setMenuOpen(false);
                  Alert.alert("Report", "Thanks, we'll review this chat.");
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
        style={{ flex: 1 }}
      >
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1,
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          renderChatEmpty={renderChatEmpty}
          textInputProps={{
            style: {
              fontFamily: "Jakarta-Regular",
              fontSize: 16,
              lineHeight: 22,
              paddingHorizontal: 12,
              paddingTop: 8,
              paddingBottom: 8,
              flex: 1,
              color: "black",
            },
            className: "bg-black",
            multiline: true,
          }}
          // bottomOffset={insets.bottom}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

