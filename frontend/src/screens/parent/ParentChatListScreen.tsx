
import React, { useEffect, useState } from "react";
import {View, TouchableOpacity, Text, TextInput, ScrollView,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { RootStackParamList} from "../../navigation/types";
import useChatStore from "../../store/useChatStore";
import styles from "../../style/parent/parentChatListStyle";
import Avatar from "../../components/Avater";

type NavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    "parentchatlist"
  >;

const ParentChatListScreen = () => {

  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState("");

  const chatUsers = useChatStore((state) => state.chatUsers);
  const searchResults = useChatStore((state) => state.searchResults);
  const getChatUsers = useChatStore((state) => state.getChatUsers);
  const searchUsers = useChatStore((state) => state.searchUsers);
  const findConversation = useChatStore((state) => state.findConversation);

  // console.log("searchResults response", searchResults);
  // console.log("chatUsers response", chatUsers);

  // existing chats
  useEffect(() => {
    getChatUsers();
  }, []);
 
  //search users
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);


  const openChat = async (selectedUser: any) => {
    
    const convo = await findConversation(selectedUser._id);

    navigation.navigate("parentchatscreen",{
        conversationId: convo?._id || null,
        receiverId: selectedUser?._id,
        receiverName: `${selectedUser?.firstName} ${selectedUser?.lastName}`,
    });
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.backText}>
        <TouchableOpacity
          onPress={() =>
            navigation.replace("ParentHome")
          }
        >
          <Ionicons name="chevron-back" size={25} color="black"/>
        </TouchableOpacity>

        <Text style={styles.title}>
          Chats
        </Text>
      </View>

      {/* SEARCH INPUT */}
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="black"/>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search users..."
          style={styles.searchInput}
        />
      </View>

      <ScrollView>
        {/* SEARCH RESULTS */}
        {search.trim() !== "" && (
          <View>
            {searchResults.map((item: any) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => openChat(item)}
                style={styles.chatsItemContainer}
              >
                <Avatar
                  imageUrl={item.profilePicture}
                  name={`${item.firstName} ${item.lastName}`}
                />
                <View style={styles.chatsItem}>
                  <Text style={styles.name}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text>
                    {item.role}
                  </Text>
                </View>
              </TouchableOpacity>

            ))}
          </View>
        )}

        {/* EXISTING CHATS */}
        <View>
          {
            search.trim() === "" && (
              <View>
                {chatUsers.map((item: any) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => openChat(item)}
                    style={styles.chatsItemContainer}
                  >
                    <Avatar
                      imageUrl={item.profilePicture}
                      name={`${item.firstName} ${item.lastName}`}
                    />
                    <View style={styles.chatsItem}>
                      <Text style={styles.name}>
                        {item.firstName} {item.lastName}
                      </Text>
                      <Text>
                        {item.role}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )
          }
          
        </View>

      </ScrollView>

    </View>
  );
};

export default ParentChatListScreen;
