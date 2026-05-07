import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import socket from "../../socket/socket";
import styles from "../../style/supperadmin/chatRoomStyle";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import useSocket from "../../hooks/useSocket";
import MessageBubble from "../../components/MessageBubble";

type NavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    "chatroom"
  >;

type ChatRouteProp =
  RouteProp<
    RootStackParamList,
    "chatroom"
  >;

const ChatRoom = () => {

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChatRouteProp>();
  // 👇 ROUTE PARAMS
  const {conversationId, receiverId, receiverName} = route.params;

  const [text, setText] = useState("");

  const user = useAuthStore((state) => state.user);
  const messages = useChatStore((state) => state.messages);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const getMessages = useChatStore((state) => state.getMessages);

  console.log("messages response", messages);
  console.log("conversationId response", conversationId);

  useSocket(user?._id || "");

  useEffect(() => {
    if (!conversationId) return;

    getMessages(conversationId);
  }, [conversationId]);

  //SOCKET LISTENERS
  useEffect(() => {
    socket.on("receive_message", (message) => {
      useChatStore.setState((state: any) => ({
        messages: [...state.messages, message ],
      }));
    });

    socket.on("message_read_update", ({ messageId }) => {
      useChatStore.setState((state: any) => ({
        messages: state.messages.map((msg: any) => msg._id === messageId ? { ...msg, status: "read" } : msg ),
      }));
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_read_update");
    };

  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{flexDirection: "row", alignItems: "center", padding: 10}}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: "700", marginLeft: 10}}>
          {receiverName}
        </Text>
      </View>

      {/* MESSAGES */}
      <FlatList
        data={messages}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) => (
          <MessageBubble msg={item} user={user} />
        )}

        contentContainerStyle={{
          padding: 10,
        }}
      />

      {/* INPUT */}
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 8,
          }}
        />

        <TouchableOpacity 
          style={{ marginLeft: 10}}
          onPress={async () => {
            if (!text.trim()) return;
            await sendMessage({
              receiverId,
              text,
              messageType: "text",
            });

            setText("");
          }}
        >
          <Ionicons
            name="send"
            size={24}
            color="blue"
          />
        </TouchableOpacity>

      </View>

    </View>
  );
};

export default ChatRoom;