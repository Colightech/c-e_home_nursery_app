
import React from 'react'
import { View, TextInput, Button, Text, TouchableOpacity, ImageBackground, 
    Image,   KeyboardAvoidingView, ScrollView, Platform, } from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from '../../style/supperadmin/settingsStyle';
import useAuthStore from "../../store/useAuthStore";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;



const SupperAdminSetting = () => {

   const navigation = useNavigation<NavigationProp>()

   const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigation.replace("login");
  }

 
  return (
    <View style={styles.container}>
      <View >
        <TouchableOpacity
          onPress={() => navigation.replace("supperadmin")}
        >
          <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutContainer}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={25} color="black" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>


        <Text>AdminSetting</Text>
      </View>
      
    </View>
  )
}

export default SupperAdminSetting;

