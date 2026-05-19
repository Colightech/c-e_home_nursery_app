
import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Text, ScrollView, ImageBackground} from "react-native";
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
import Video from "react-native-video";
import saveToGallery from "../../utils/saveToGallery";



type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "chatroom"
  >;

type ChatRouteProp = RouteProp<
    RootStackParamList,
    "chatroom"
  >;

  type ViewerState = {
    uri: string;
    type: any["messageType"];
    message: any;
  };


const ChatRoom = () => {

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChatRouteProp>();

  const routeConversationId = route.params?.conversationId || null;
  const { receiverId, receiverName } = route.params;
  const [conversationId, setConversationId] = useState(routeConversationId);

  const [text, setText] = useState("");
  const [showAttachments, setShowAttachments] = useState<boolean>(false);
  const [viewer, setViewer] = useState<ViewerState | null>(null);

 

  // ANIMATED VALUES
  const slideAnim = useRef( new Animated.Value(300)).current;

  const scrollRef = useRef<ScrollView>(null);


  const user = useAuthStore((state) => state.user);
  const messages = useChatStore((state) => state.messages);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const getMessages = useChatStore((state) => state.getMessages);
  const uploadMedia = useChatStore((state) => state.uploadMedia);

  const setOnlineUsers = useChatStore((state) => state.setOnlineUsers);
  const onlineUsers = useChatStore((state) => state.onlineUsers);

   console.log("onlineUsers response", onlineUsers);

  const isReceiverOnline = onlineUsers.includes(receiverId);
  console.log("isReceiverOnline response", isReceiverOnline);

  // console.log("messages response", messages);
  // console.log("user response", user);

  // console.log("USER ID IN CHAT ROOM:", user?._id);
  // console.log("USER IN CHAT ROOM:", user);


  useEffect(() => {
    // clear old messages first
    useChatStore.setState({
      messages: [],
    });
    if (!conversationId) return;
    getMessages(conversationId);
  }, [conversationId]);


  

  // Send login user to backend
  useSocket(user?._id || "");


  //SOCKET LISTENERS
  useEffect(() => {

      //Recieve the list users online
      socket.on("getOnlineUsers", (onlineUsers) => {
        console.log("ONLINE USERS FROM SERVER:", onlineUsers);

       setOnlineUsers(onlineUsers);
      });

    socket.on("receive_message", (message) => {
      useChatStore.setState((state: any) => {
        const exists = state.messages.find((m: any) => m._id === message._id);
        if (exists) return state;

        return {
          messages: [
            ...state.messages,
            { ...message, status: "delivered" },
          ],
        };
      });

      //  send ACK back to server
      socket.emit("message_received_ack", {
        messageId: message._id,
        senderId: message.sender,
      });
    });

  

    socket.on("message_delivered", ({ tempId, messageId, conversationId }) => {
      useChatStore.setState((state: any) => ({
        messages: state.messages.map((msg: any) =>
          msg._id === tempId
            ? {
                  ...msg,
                  _id: messageId,
                  conversationId,
                  status: "delivered",
              }
            : msg
        ),
      }));
      setConversationId(conversationId);
    });


    socket.on("message_viewed", ({ messageId }) => {
      useChatStore.setState((state: any) => ({
        messages: state.messages.map((msg: any) =>
          msg._id === messageId
            ? {
                ...msg,
                status: "viewed",
              }
            : msg
        ),
      }));
    });


    return () => {
      socket.off("getOnlineUsers");
      socket.off("receive_message");
      socket.off("message_delivered");
      socket.off("message_viewed");
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



  useEffect(() => {
      useChatStore.getState().restoreQueue();
  }, []);



  
  const handlePickDocument = async () => {

    try {
      setShowAttachments(false);

      const hasPermission = await requestMediaPermission( "document");
      if (!hasPermission) {
        console.log( "DOCUMENT PERMISSION DENIED");
        return;
      }

      console.log( "OPENING DOCUMENT PICKER");

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

      if (!file) return;

      console.log("PICKED FILE:", file);

      //TEMP MESSAGE
      const tempId = Date.now().toString();
      const tempMessage = {
        _id: tempId,
        conversationId,
        sender: user,
        messageType: "document",
        text: file.name,
        media: {
          localUri: file.uri,
          remoteUri: null,
        },
        retryData: file,
        status: "uploading",
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      console.log( "handlePickDocument tempMessage:",  tempMessage);

      //INSTANT UI
      useChatStore.setState((state: any) => ({
        messages: [ ...state.messages, tempMessage],
      }));

      //UPLOAD FILE
      const uploadedFile = await uploadMedia(file, (percent: number) => {
        useChatStore.setState((state: any) => ({
          messages: state.messages.map((m: any) =>
              m._id === tempId
                ? {
                    ...m,
                    progress: percent,
                    status:
                      percent >= 100
                        ? "processing"
                        : "uploading",
                  }
                : m
            ),
        }));
      });

      console.log("handlePickDocument uploadedFile:", uploadedFile);

      //FAILED UPLOAD
      if (!uploadedFile) {
        useChatStore.setState((state: any) => ({
          messages: state.messages.map((m: any) =>
              m._id === tempId
                ? {
                    ...m,
                    status: "failed",
                  }

                : m
            ),
        }));
        return;
      }

      //UPDATE LOCAL MESSAGE
      useChatStore.setState((state: any) => ({
        messages: state.messages.map((m: any) =>
            m._id === tempId
              ? {
                  ...m,
                  media: {
                    localUri: file.uri,
                    remoteUri: uploadedFile.url,
                  },
                  progress: 100,
                  status: "sending",
                }
              : m
          ),
      }));

      //SEND TO DATABASE
      const res = await sendMessage({
        conversationId,
        receiverId,
        text: file.name,
        messageType: "document",
        media: uploadedFile,
        tempId,
      });

      console.log("DOCUMENT MESSAGE RESPONSE:", res);

      //FAILED SEND
      if (!res) {
        useChatStore.setState((state: any) => ({
          messages: state.messages.map((m: any) =>
              m._id === tempId
                ? {
                    ...m,
                    status: "failed",
                  }
                : m
            ),
        }));
        return;
      }

      //NEW CONVERSATION
      if (!conversationId && res?.conversationId) {
        setConversationId( res.conversationId);
      }

    } catch (error) {
      console.log( "DOCUMENT PICK ERROR:", error);
    }
  };



  const handlePickImage = async () => {
    console.log("handlePickImage was called");
    try {

      const hasPermission = await requestMediaPermission();
      if (!hasPermission) return;

      setShowAttachments(false);

      const result = await launchImageLibrary({
          mediaType: "mixed",
          quality: 0.8,
          selectionLimit: 1,
        });

      const asset = result.assets?.[0];

      if (!asset) return;

      const isVideo = asset.type?.startsWith("video");

      //CREATE TEPORARY MESSAGE
      const tempId = Date.now().toString();
      const tempMessage = {
        _id: tempId,
        tempId: tempId, // ADD THIS
        conversationId,
        sender: user,
        messageType: isVideo ? "video" : "image",
        text: "",
        media: {
          localUri: asset.uri,
          remoteUri: null,
        },
        retryData: asset,
        status: "sending",
        progress: 0,
        createdAt:
          new Date().toISOString(),
      };

      console.log( "handlePickImage: tempMessage", tempMessage);

      //INSTANT UI
      useChatStore.setState((state: any) => ({
        messages: [...state.messages, tempMessage],
      }));

      //UPLOAD MEDIA
      const uploadedFile = await uploadMedia( asset, (percent: number) => {
        useChatStore.setState((state: any) => ({
          messages: state.messages.map((m: any)  =>
              m._id === tempId
                ? {
                    ...m,
                    progress: percent,
                    status: percent >= 100
                        ? "processing"
                        : "sending",
                  }
                : m
            ),
        }));
      });

      console.log("handlePickImage: uploadedFile", uploadedFile);
      
      //FAILED UPLOAD
      if (!uploadedFile) {
        useChatStore.setState((state: any) => ({
          messages: state.messages.map((m: any) =>
              m._id === tempId
                ? {
                    ...m,
                    status: "failed",
                  }
                : m
            ),
        }));
        return;
      }

      // UPDATE TEMP MESSAGE
      useChatStore.setState((state: any) => ({
        messages: state.messages.map((m: any) =>
            m._id === tempId
              ? {
                  ...m,
                  media: {
                    localUri: asset.uri,
                    remoteUri: uploadedFile.url,
                  },
                  progress: 100,
                  status: "sending",
                }
              : m
          ),
      }));

      // SEND MESSAGE TO DATABASE
      const res = await sendMessage({
        conversationId,
        receiverId,
        text: "",
        messageType:
          isVideo ? "video" : "image",
        media: uploadedFile,
        tempId,
      });

      console.log("handlePickImage: sendMessage", res);

    //  FAILED DB SEND
      if (!res) {
        useChatStore.setState((state: any) => ({
          messages: state.messages.map((m: any) =>
              m._id === tempId
                ? {
                    ...m,
                    status: "failed",
                  }
                : m
            ),
        }));
        return;
      }

      // NEW CONVERSATION
      if (!conversationId && res?.conversationId) {
        setConversationId(res.conversationId);
      }
    } catch (error) {
      console.log("HANDLE IMAGE ERROR:",  error);
    }
  };


  const handleOpenCamera = () => {}



  // Retry Function 
  const retryMessage = async (msg: any) => {
    useChatStore.setState((state: any) => ({
      messages: state.messages.map((m: any) =>
        m._id === msg._id
          ? {
              ...m,
              status: "uploading",
              progress: 0,
            }
          : m
      ),
    }));

    const uploadedFile = await uploadMedia(msg.retryData, (percent: any) => {
      useChatStore.setState((state: any) => ({
        messages: state.messages.map((m: any) =>
          m._id === msg._id
            ? {
                ...m,
                progress: percent,
              }
            : m
        ),
      }));
    });

    if (!uploadedFile) {
      useChatStore.setState((state: any) => ({
        messages: state.messages.map((m: any) =>
          m._id === msg._id
            ? {
                ...m,
                status: "failed",
              }
            : m
        ),
      }));
      return;
    }

    await sendMessage({
      conversationId: msg.conversationId,
      receiverId,
      text: msg.text,
      messageType: msg.messageType,
      media: uploadedFile,
      tempId: msg._id,
    });
  };


  const openViewer = (msg: any) => {
    const uri =
      msg.media?.remoteUri ||
      msg.media?.localUri ||
      msg.media?.url;

    if (!uri) return;

    setViewer({
      uri,
      type: msg.messageType,
      message: msg,
    });
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
          <View style={styles.nameAndRealTimeContainer}>
            <Text style={styles.name}>
              {receiverName}
            </Text>
            <View style={styles.onlineOfflineContainer}>
              {
                isReceiverOnline ? (
                  <Text style={styles.online}>online</Text>
                ) : (
                  <Text style={styles.offline}>offline</Text>
                )
              }
            </View>
          </View>
        </View>
      </View>

      {/* IMAGE PREVIEW SECTION */}
      {viewer && (
        <View
          style={styles.previewContainer}
        >
          <TouchableOpacity
            onPress={() => setViewer(null)}
            style={styles.closePreview}
          >
            <Text style={styles.closePreviewBtn}>✕</Text>
          </TouchableOpacity>

          {viewer.type === "image" && (
            <Image
              source={{ uri: viewer.uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />          
          )}

          {viewer.type === "video" && (
            <Video
              source={{ uri: viewer.uri }}
              style={{ width: "100%", height: "100%" }}
              controls
              resizeMode="contain"
            />
          )}

          {/* MEDIA DOWNLOAD */}
          <TouchableOpacity
            onPress={() => saveToGallery(viewer.uri)}
            style={styles.download}
          >
            <Text style={styles.downloadText}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      )}

     
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
            <MessageBubble 
              msg={i} 
              user={user} 
              key={index} 
              retryMessage={retryMessage}
              openViewer={openViewer}
            />
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

            const tempId = Date.now().toString();

            const tempMessage = {
              _id: tempId,
              tempId: tempId, 
              conversationId,
              sender: user,
              messageType: "text",
              text,
              status: "sending",
              createdAt: new Date().toISOString(),
            };

            useChatStore.setState((state: any) => ({
              messages: [...state.messages, tempMessage],
            }));

            setText("");

            const res = await sendMessage({
              conversationId,
              receiverId,
              text,
              messageType: "text",
              tempId,
            });

            if (!conversationId && res?.conversationId) {
              setConversationId(res.conversationId);
            }

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