import React from 'react'
import { Text, View, TouchableOpacity} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from '../../style/parent/parentAttendanceStyle';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const ParentAttendance = () => {

      const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
         <TouchableOpacity
          onPress={() => navigation.replace("ParentHome")}
          style={styles.backIcon}
        >
          <Ionicons name="chevron-back" size={35} color="white" />
        </TouchableOpacity>
      <Text>ParentAttendance</Text>
    </View>
  )
}

export default ParentAttendance
