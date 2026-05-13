

import { View, Text, Image } from "react-native";
import styles from "../style/supperadmin/chatRoomStyle";
import type { Message, User } from "../store/types";
 import Video from "react-native-video";

type Props = {
  msg: Message;
  user: User | null;
};

const MessageBubble = ({ msg, user }: Props) => {



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
        {msg.status === "sending" && (
          <View style={{ marginTop: 5 }}>
            <Text style={{ fontSize: 12, opacity: 0.6 }}>
              Sending... {msg.progress || 0}%
            </Text>
          </View>
        )}


        {msg.messageType === "image" && msg.status === "sending" && (
          <View style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 5,
            borderRadius: 8
          }}>
            <Text style={{ color: "white", fontSize: 12 }}>
              {msg.progress}%
            </Text>
          </View>
        )}


        {msg.messageType === "image" && msg.media?.url && (
          <Image 
            source={{ uri: msg.media.url }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}

       
        {/* VIDEO */}
        {msg.messageType === "video" &&
          msg.media?.url && (
            <Video
              source={{ uri: msg.media.url }}
              style={{
                width: 250,
                height: 300,
                borderRadius: 10,
              }}
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
      
        <Text style={styles.time}>
          {new Date( msg.createdAt ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;