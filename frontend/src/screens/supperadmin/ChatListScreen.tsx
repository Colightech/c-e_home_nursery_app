import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../store/useAuthStore";
import useChatStore from "../../store/useChatStore";

const ChatListScreen = () => {

  const navigation = useNavigation<any>();

  const user = useAuthStore(
    (state) => state.user
  );

  const createConversation = useChatStore(
    (state) => state.createConversation
  );

  const openChat = async (user: any) => {

    const convo = await createConversation(user._id);

    if (!convo) return;

    navigation.navigate("ChatRoom", {
      conversationId: convo._id,
      receiverId: user._id,
      receiverName: `${user.firstName} ${user.lastName}`,
    });
  };

  return (
    <View style={{ flex: 1 }}>

      <FlatList
        data={user}
        keyExtractor={(item) => item._id}

        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openChat(item)}
            style={{
              padding: 15,
              borderBottomWidth: 1,
            }}
          >
            <Text>
              {item.firstName} {item.lastName}
            </Text>

            <Text>
              {item.role}
            </Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );
};

export default ChatListScreen;