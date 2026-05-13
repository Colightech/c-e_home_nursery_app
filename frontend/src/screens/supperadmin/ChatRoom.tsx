
import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text, ScrollView, ImageBackground} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import { pick } from "@react-native-documents/picker";
import { Animated } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import socket from "../../socket/socket";
import styles from "../../style/supperadmin/chatRoomStyle";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import useSocket from "../../hooks/useSocket";
import MessageBubble from "../../components/MessageBubble";
import Avatar from "../../components/Avater";
import  requestMediaPermission  from "../../utils/requestMediaPermission";


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

  const routeConversationId = route.params?.conversationId || null;
  const { receiverId, receiverName } = route.params;
  const [conversationId, setConversationId] = useState(routeConversationId);

  const [text, setText] = useState("");
  const [showAttachments, setShowAttachments] = useState<boolean>(false);

  // ANIMATED VALUES
  const slideAnim = useRef( new Animated.Value(300)).current;

  const scrollRef = useRef<ScrollView>(null);


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


  useEffect(() => {
      Animated.spring(slideAnim, {
        toValue: showAttachments ? 0 : 300,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
  }, [showAttachments]);






  const handlePickDocument = async () => {

    setShowAttachments(false);

    try {

      const hasPermission = await requestMediaPermission("document");

      if (!hasPermission) {
        console.log("DOCUMENT PERMISSION DENIED");
        return;
      }

      console.log("OPENING DOCUMENT PICKER");

      const [file] = await pick({
        allowMultiSelection: false,

        type: [
          "application/pdf",

          "application/msword",

          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

          "application/vnd.ms-excel",

          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          "text/plain",
        ],
      });

      console.log("PICKED FILE:", file);

      if (!file) return;


      const tempId = Date.now().toString();
      const tempMessage = {
        _id: tempId,
        conversationId,
        sender: user,
        messageType: "document",
        text: file.name,
        media: null,
        status: "sending",
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      useChatStore.setState((state: any) => ({
        messages: [...state.messages, tempMessage],
      }));



      const uploadedFile = await uploadMedia(file, (percent: any) => {
        useChatStore.setState((state: any) => ({
          messages: state.messages.map((m: any) =>
            m._id === tempId
              ? { ...m, progress: percent }
              : m
          ),
        }));
      });

      console.log("UPLOADED FILE:", uploadedFile);

      if (!uploadedFile) return;


      // const res = await sendMessage({
      //   conversationId,
      //   receiverId,

      //   text: uploadedFile.fileName,

      //   messageType: "document",

      //   media: {
      //     url: uploadedFile.url,
      //     fileName: uploadedFile.fileName,
      //     fileType: uploadedFile.fileType,
      //     fileSize: uploadedFile.fileSize,
      //   },
      // });


      const res = await sendMessage({
        conversationId,
        receiverId,
        text: file.name,
        messageType: "document",
        media: uploadedFile,
        tempId,
      });

      console.log("DOCUMENT MESSAGE RESPONSE:", res);

      if (!conversationId &&
        res?.conversationId) {

        setConversationId(
          res.conversationId
        );
      }

    } catch (error) {

      console.log(
        "DOCUMENT PICK ERROR:",
        JSON.stringify(error, null, 2)
      );
    }
  };




  const handlePickImage = async () => {

    try {

      const hasPermission = await requestMediaPermission();

      setShowAttachments(false);

      if (!hasPermission) {
        console.log("Permission denied");
        return;
      }
      const result = await launchImageLibrary({
          mediaType: "mixed",
          quality: 0.8,
          selectionLimit: 1,
        });
      if (result.didCancel) return;

      const asset = result.assets?.[0];

      if (!asset) return;


      const tempId = Date.now().toString();
      const tempMessage = {
        _id: tempId,
        conversationId,
        sender: user,
        messageType: asset.type?.startsWith("video") ? "video" : "image",
        text: "",
        media: { uri: asset.uri },
        status: "sending",
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      useChatStore.setState((state: any) => ({
        messages: [...state.messages, tempMessage],
      }));

      // upload
      // const uploadedFile = await uploadMedia(asset);
    
      const uploadedFile = await uploadMedia(asset, (percent: any) => {
        useChatStore.setState((state: any) => ({
          messages: state.messages.map((m: any) =>
            m._id === tempId
              ? { ...m, progress: percent }
              : m
          ),
        }));
      });


      if (!uploadedFile) return;

      // const res = await sendMessage({
      //   conversationId,
      //   receiverId,
      //   text: uploadedFile.url,

      //   messageType: asset.type?.startsWith("video")
      //       ? "video"
      //       : "image",

      //   media: uploadedFile,
      // });


      const res = await sendMessage({
        conversationId,
        receiverId,
        text: uploadedFile.url,
        messageType: asset.type?.startsWith("video") ? "video" : "image",
        media: uploadedFile,
        tempId,
      });

      if (!conversationId && res?.conversationId) {
        setConversationId( res.conversationId );
      }

    } catch (error) {
      console.log( "IMAGE PICK ERROR:", error);
    }
  };




  const handleOpenCamera = () => {

  }




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
        <ScrollView
          ref={scrollRef}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
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

        {/* OPEN ATTACHMENT TRAY BUTTON*/}
        <TouchableOpacity
          onPress={() => setShowAttachments(prev => !prev)}
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

            setTimeout(() => {
              scrollRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        >
          <Ionicons name="send" size={24} color="blue"/>
        </TouchableOpacity>
      </View>

  
      {/* OPEN ATTACHMENT TRAY */}
      <Animated.View
        style={[
            styles.openAttachmentContainer,
            {
              transform: [
                { translateY: slideAnim }
              ],

              opacity: showAttachments ? 1 : 0,
            },
        ]}
      >

        <View style={styles.attachmentFlex}>
          {/* GALLERY */}
          <TouchableOpacity
            style={styles.attachItems}
            onPress={handlePickImage}
          >
            <View style={styles.galleryIcon}>
              <Ionicons  name="images"  size={28}  color="white" />
            </View>

            <Text style={styles.text}>
              Gallery
            </Text>
          </TouchableOpacity>


          {/* CAMERA */}
          <TouchableOpacity
            style={styles.attachItems}
            onPress={handleOpenCamera}
          >
            <View style={styles.cameraIcon}>
              <Ionicons  name="camera"  size={28} color="white"/>
            </View>

            <Text style={styles.text}>
              Camera
            </Text>
          </TouchableOpacity>


          {/* DOCUMENT */}
          <TouchableOpacity
            style={styles.attachItems}
            onPress={handlePickDocument}
          >
            <View style={styles.documentIcon}>
              <Ionicons  name="document" size={28}  color="white" />
            </View>

            <Text style={styles.text}>
              Document
            </Text>
          </TouchableOpacity>
        </View>

      </Animated.View>   
    </View>
  );
};

export default ChatRoom;