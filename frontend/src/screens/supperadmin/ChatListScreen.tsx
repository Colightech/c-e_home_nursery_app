import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { RootStackParamList } from "../../navigation/types";
import useAdminStore from "../../store/useAdminStore";
import useChatStore from "../../store/useChatStore";

type NavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    "chatlistscreen"
  >;

const ChatListScreen = () => {

  const navigation = useNavigation<NavigationProp>();

  const users = useAdminStore((state) => state.users);
  const fetchUsers = useAdminStore((state) => state.fetchUsers);
  const createConversation = useChatStore((state) => state.createConversation);
  

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const openChat = async (selectedUser: any) => {

    const convo = await createConversation(selectedUser._id);
    console.log("convo response", convo);
    if (!convo) return;

    navigation.navigate("chatroom", {
      conversationId: convo._id,
      receiverId: selectedUser._id,
      receiverName: `${selectedUser.firstName} ${selectedUser.lastName}`,
    });

  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.replace("supperadmin")}
      >
        <Ionicons name="chevron-back" size={35} color="black" />
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}

        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openChat(item)}
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
              }}
            >
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