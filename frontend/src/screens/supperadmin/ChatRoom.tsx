



import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import styles from "../../style/supperadmin/chatRoomStyle";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const ChatRoom = () => {

  const navigation = useNavigation<NavigationProp>();

  return (
    <View
      style={styles.container}
    >
        <TouchableOpacity
            onPress={() => navigation.replace("supperadmin")}
        >
            <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>
        <Text>Chat Room</Text>
    </View>
  );
};

export default ChatRoom;

