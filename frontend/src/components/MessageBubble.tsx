

import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../style/supperadmin/chatRoomStyle";
import type { Message, User } from "../store/types";
import Video from "react-native-video";



type Props = {
  msg: Message;
  user: User | null;
  retryMessage?: (msg: Message) => void;
  openViewer: (msg: Message) => void;
};



const MessageBubble = ({ msg, retryMessage, openViewer,  user }: Props) => {



  const senderId = typeof msg.sender === "object"
      ? msg.sender._id?.toString()
      : msg.sender?.toString();

  const isMyMessage = senderId === user?._id?.toString();


  return (
    <View
      style={{ width: "100%", marginVertical: 5, paddingHorizontal: 10,
        alignItems: isMyMessage
          ? "flex-end"
          : "flex-start",
        
      }}
    >
      <View style={{
          maxWidth: "75%",
          padding: 5,
          borderRadius: 12,
          backgroundColor: isMyMessage
          ? "#fbcbff"
          : "#E5E5EA",
        }}
      >
    
        {msg.text && (
          <Text style={{
              color: isMyMessage
                ? "black"
                : "black",
            }}>
            {msg.text}
          </Text>
        )}

        {/* PROGRESS SECTION IN PROGRESS */}
        {/* UPLOADING */}
        {msg.status === "sending" && (
          <View style={{ marginBottom: 2 }}>
            <Text style={styles.progress}>
              Uploading... {msg.progress || 0}%
            </Text>
          </View>
        )}
        {/* PROCESSING */}
        {msg.status === "processing" && (
          <View style={{ marginBottom: 2 }}>
            <Text style={styles.progress}>
              Processing media...
            </Text>
          </View>
        )}
        {/* FAILED */}
        {msg.status === "failed" && (
          <View style={{ marginBottom: 2 }}>
            <Text style={{ fontSize: 15, color: "red"}}>
              Failed to send
            </Text>
          </View>
        )}

        {/* IMAGE RENDER SECTION */}
        {msg.messageType === "image" && (
          msg.media?.remoteUri ||
          msg.media?.localUri ||
          msg.media?.url
        ) && (
          <TouchableOpacity onPress={() => openViewer(msg)}>
            <Image
              source={{
                uri:
                  msg.media?.remoteUri ||
                  msg.media?.localUri ||
                  msg.media?.url
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

       
        {/* VIDEO */}
       {msg.messageType === "video" && (
          msg.media?.remoteUri ||
          msg.media?.localUri ||
          msg.media?.url
        ) && (
            <Video
              source={{
                uri:
                  msg.media?.remoteUri ||
                  msg.media?.localUri ||
                  msg.media?.url
              }}
              style={styles.video}
              controls
              paused={true}
              resizeMode="cover"
            />
        )}

        {/* FILE MESSAGE */}
          {
            msg.messageType === "document" && (
              <View
                style={{
                  padding: 10,
                  backgroundColor: "#eee",
                  borderRadius: 10,
                }}
              >
                <Text>
                  {msg.media?.fileName}
                </Text>
              </View>
            )
          }

        {msg.status === "failed" && retryMessage && (
          <TouchableOpacity onPress={() => retryMessage(msg)}>
            <Text style={styles.retry}>
              Retry
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.timeAndStatus}>
          <Text style={styles.time}>
            {new Date( msg.createdAt ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </Text>

          <Text>
            {msg.status === "sending" && "🕓"}
            {msg.status === "processing" && "🕓"}
            {msg.status === "sent" && "✓"}
            {msg.status === "delivered" && "✓✓"}
            {msg.status === "viewed" && "💙✓✓"}
          </Text>
        </View>
      </View>

      {/* {viewer && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
          onPress={() => setViewer(null)}
        >
          {viewer.type === "image" && (
            <Image
              source={{ uri: viewer.uri }}
              style={{ width: "100%", height: 400 }}
              resizeMode="contain"
            />
          )}

          {viewer.type === "video" && (
            <Video
              source={{ uri: viewer.uri }}
              style={{ width: "100%", height: 400 }}
              controls
            />
          )}
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default MessageBubble;