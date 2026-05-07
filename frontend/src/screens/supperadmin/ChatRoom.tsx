



import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";

import styles from "../../style/supperadmin/chatRoomStyle";
import { useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import socket from "../../socket/socket";
import useChatStore from "../../store/useChatStore";
import MessageBubble from "../../components/MessageBubble";
import useAuthStore from "../../store/useAuthStore";
import useSocket from "../../hooks/useSocket";



type ChatRoom = {
  conversationId: string;
  receiverId: string;
  receiverName: string;
};



type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ChatRouteProp = RouteProp<RootStackParamList>;



const ChatRoom = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChatRouteProp>();

  const { conversationId, receiverId, receiverName } = route.params;

  const [text, setText] = useState("");


  const sendMessage = useChatStore((state) => state.sendMessage);
  const messages = useChatStore((state) => state.message);
  const getMessages = useChatStore((state) => state.getMessages);
  const user = useAuthStore((state) => state.user);

  console.log("user response", user);
  console.log("messages response", messages);

  useSocket(user?._id || "");

  
  useEffect(() => {
    if (!conversationId) return;

    getMessages(conversationId);
  }, [conversationId]);


  useEffect(() => {
    socket.on("receive_message", (message) => {
      useChatStore.setState((state: any) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on("message_read_update", ({ messageId }) => {
      useChatStore.setState((state: any) => ({
        messages: state.messages.map((msg: any) =>
          msg._id === messageId ? { ...msg, status: "read" } : msg
        ),
      }));
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_read_update");
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.replace("supperadmin")}>
        <Ionicons name="chevron-back" size={35} color="black" />
      </TouchableOpacity>

      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageBubble msg={item} user={user} />
        )}
      />
      <Text>Chat room</Text>

      <View style={{ flexDirection: "row" }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type message"
          style={{
            flex: 1,
            borderWidth: 1,
          }}
        />

        <TouchableOpacity
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
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};


export default ChatRoom;

