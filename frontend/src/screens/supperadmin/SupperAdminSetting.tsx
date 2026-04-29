
import React from 'react'
import { View, TextInput, Button, Text, TouchableOpacity, ImageBackground, 
    Image,   KeyboardAvoidingView, ScrollView, Platform, } from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from '../../style/supperadmin/settingsStyle';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;



const SupperAdminSetting = () => {

  const navigation = useNavigation<NavigationProp>()
  return (
    <View style={styles.container}>
      <View >
        <TouchableOpacity
          onPress={() => navigation.replace("supperadmin")}
        >
          <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>
        <Text>AdminSetting</Text>
      </View>
    </View>
  )
}

export default SupperAdminSetting;

