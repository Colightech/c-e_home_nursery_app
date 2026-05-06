

import { View, Text, Image } from "react-native";
import styles from "../style/supperadmin/chatRoomStyle";
import type { Message, User } from "../store/types";

type Props = {
  msg: Message;
  user: User | null;
};

const MessageBubble = ({ msg, user }: Props) => {
  const isMe = msg.sender === user?._id;

  return (
    <View
      style={[
        styles.bubble,
        isMe ? styles.myMsg : styles.otherMsg,
      ]}
    >
      {msg.text && <Text>{msg.text}</Text>}

      {msg.media?.url && (
        <Image source={{ uri: msg.media.url }} style={styles.image} />
      )}

      <Text>
        {new Date(msg.createdAt).toLocaleTimeString()}
      </Text>
      <Text></Text>
    </View>
  );
};

export default MessageBubble;