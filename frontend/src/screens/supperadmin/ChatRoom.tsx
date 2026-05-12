
import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text, ScrollView, ImageBackground} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import { pick } from "@react-native-documents/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import socket from "../../socket/socket";
import styles from "../../style/supperadmin/chatRoomStyle";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import useSocket from "../../hooks/useSocket";
import MessageBubble from "../../components/MessageBubble";
import Avatar from "../../components/Avater";

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

  // const {conversationId = null, receiverId, receiverName} = route.params || {};

  const routeConversationId = route.params?.conversationId || null;
  const { receiverId, receiverName } = route.params;
  const [conversationId, setConversationId] = useState(routeConversationId);

  const [text, setText] = useState("");
 

  const user = useAuthStore((state) => state.user);
  const messages = useChatStore((state) => state.messages);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const getMessages = useChatStore((state) => state.getMessages);
  const uploadMedia = useChatStore((state) => state.uploadMedia);


  // console.log("messages response", messages);
  // console.log("user response", user);

  // console.log("USER ID IN CHAT ROOM:", user?._id);
  // console.log("USER IN CHAT ROOM:", user);


  useSocket(user?._id || "");


  useEffect(() => {
    // clear old messages first
    useChatStore.setState({
      messages: [],
    });
    if (!conversationId) return;
    getMessages(conversationId);
  }, [conversationId]);



  //SOCKET LISTENERS
  useEffect(() => {
    socket.on("receive_message", (message) => {
      if (message.conversationId !== conversationId) {
        return;
      }
      useChatStore.setState((state: any) => ({
        messages: [...state.messages, message],
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




  const handlePickMedia = async () => {
    
    try {
      const [file] = await pick({
        allowMultiSelection: false,
        type: [
          "image/*",
          "video/*",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain",
        ],
      });

      const uploadedFile = await uploadMedia(file);

      if (!uploadedFile) return;

      const res = await sendMessage({
        conversationId,
        receiverId,
        text: uploadedFile.url,
        messageType:
          file.type?.startsWith("image")
            ? "image"
            : file.type?.startsWith("video")
            ? "video"
            : "file",
        media: uploadedFile,
      });

      if (!conversationId && res?.conversationId) {
        setConversationId(res.conversationId);
      }

    } catch (error) {
      console.log(error);
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.arrowAndNameContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>
        <View style={styles.avatarName}>
          <Avatar 
            imageUrl=""
            name={receiverName}
          />
          <Text style={styles.name}>
            {receiverName}
          </Text>
        </View>
      </View>

     
      {/* MESSAGES */}
      <ImageBackground style={{ flex: 1,}}
        source={require("../../assets/chatbg.jpg")}
        resizeMode="cover"
      >
        <ScrollView>
        {
          messages.map((i: any, index: any) => (
            <MessageBubble msg={i} user={user} key={index} />
          ))
        }
        </ScrollView>
      </ImageBackground>
    
      {/* INPUT */}
      <View
        style={styles.inputContainer}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type message..."
          style={styles.inputText}
        />

        <TouchableOpacity
          onPress={handlePickMedia}
          style={{ marginRight: 10 }}
        >
          <Ionicons name="attach" size={24} color="black"/>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginLeft: 10}}
          onPress={async () => {
            if (!text.trim()) return;

            const res = await sendMessage({
              conversationId,
              receiverId,
              text,
              messageType: "text",
            });

            // first message creates conversation
            if (!conversationId && res?.conversationId) {
              setConversationId(res.conversationId);
            }

            setText("");
          }}
        >
          <Ionicons name="send" size={24} color="blue"/>
        </TouchableOpacity>

      </View>
     
    </View>
  );
};

export default ChatRoom;