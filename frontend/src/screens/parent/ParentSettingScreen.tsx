
import React from 'react'
import { View, TextInput, Button, Text, TouchableOpacity, ImageBackground, 
    Image,   KeyboardAvoidingView, ScrollView, Platform, } from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from '../../style/parent/parentSettingStyle';
import useAuthStore from "../../store/useAuthStore";
import Avatar from '../../components/Avater';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;



const ParentSettingScreen = () => {

   const navigation = useNavigation<NavigationProp>()

   const logout = useAuthStore((state) => state.logout);
   const user = useAuthStore((state) => state.user);

   console.log("user response", user);

  const handleLogout = async () => {
    await logout();
    navigation.replace("login");
  }

 
  return (
    <View style={styles.container}>
      <View >
        <TouchableOpacity
          onPress={() => navigation.replace("parent")}
          style={styles.backIcon}
        >
          <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>

        <View style={styles.subContainer}>
          <View style={styles.profileContainer}>
             <Avatar 
              imageUrl=''  
              name={user?.name}
            />
            <View>
                <Text><Text style={styles.profileDetails}>Name: </Text>{user?.name}</Text>
                <Text><Text style={styles.profileDetails}>Role: </Text>{user?.role}</Text>
                <Text><Text style={styles.profileDetails}>Email: </Text>{user?.email}</Text>
            </View>
          </View>
          <View style={styles.borderLine}></View>

          <TouchableOpacity 
            style={styles.logoutContainer}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={25} color="black" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ParentSettingScreen;

