

import { View, Text, Image } from "react-native";
import styles from "../style/supperadmin/chatRoomStyle";
import type { Message, User } from "../store/types";

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
          padding: 10,
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

        {msg.media?.url && (
          <Image source={{ uri: msg.media.url }} style={styles.image} />
        )}

        <Text style={styles.time}>
          {new Date(msg.createdAt).toLocaleTimeString()}
        </Text>
        <Text></Text>
      </View>
    </View>
  );
};

export default MessageBubble;