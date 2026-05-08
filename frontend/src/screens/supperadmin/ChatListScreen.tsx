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
import styles from "../../style/supperadmin/chatListStyle";
import Avatar from "../../components/Avater";

type NavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    "chatlistscreen"
  >;

const ChatListScreen = () => {

  const navigation = useNavigation<NavigationProp>();

  const users = useAdminStore((state) => state.users);
  const fetchUsers = useAdminStore((state) => state.fetchUsers);
  const getConversation = useChatStore((state) => state.getConversation);
  

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const openChat = async (selectedUser: any) => {

    const convo = await getConversation(selectedUser._id);
    console.log("convo response", convo);
    if (!convo) return;

    navigation.navigate("chatroom", {
      conversationId: convo._id,
      receiverId: selectedUser._id,
      receiverName: `${selectedUser.firstName} ${selectedUser.lastName}`,
    });

  };

  return (
    <View style={styles.container}>
      <View style={styles.backText}>
        <TouchableOpacity
          onPress={() => navigation.replace("supperadmin")}
        >
          <Ionicons name="chevron-back" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Chats</Text>
      </View>

      <View style={styles.chats}>
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.chatsItemContainer}>
              <Avatar 
                imageUrl=""
                name={`${item.firstName} ${item.lastName}`} 
              />

              <TouchableOpacity
                onPress={() => openChat(item)}
                style={styles.chatsItem}
              >
                <Text style={styles.name}>
                  {item.firstName} {item.lastName}
                </Text>

                <Text>
                  {item.role}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
     
    </View>
  );
};

export default ChatListScreen;