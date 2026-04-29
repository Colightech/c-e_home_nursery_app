import React, { useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import useAdminStore from "../../store/useAdminStore";
import StatCard from "../../components/StatCard";
import styles from "../../style/supperadmin/dashboardStyle"
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const bottomItems = [
  {id: 1, label: "Home", icon: (<Ionicons name="home-outline" size={25} color="black" />) },
  {id: 2, label: "Chat", icon: (<Ionicons name="chatbubble-outline" size={25} color="black" />) },
  {id: 3, label: "Children", icon: (<Ionicons name="people-outline" size={25} color="black" />) },
  {id: 4, label: "Learning", icon: (<Ionicons name="school-outline" size={25} color="black" />) }
]



const SupperAdminScreen = () => {

    const fetchStats = useAdminStore((state) => state.fetchStats);
    const stats = useAdminStore((state) => state.stats);
    const loading = useAdminStore((state) => state.loading);
    const error = useAdminStore((state) => state.error);

    const navigation = useNavigation<NavigationProp>()

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.appNameContainer}>
          <Text style={styles.nameTitle}>
            Home nursery
          </Text>
          <View style={styles.addAndSettings}>
            <TouchableOpacity
              onPress={() => navigation.replace("adduser")}
            >
              <Image
                source={require("../../assets/plus1.png")}
                style={styles.addUser}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.replace("supperAdminSetting")}
            >
              <Ionicons name="settings-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.dashboardBox}>
            <View style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Text>Wednesday 24 December</Text>
                <Text>C & E</Text>
            </View>
            <View style={{padding: 10}}>
              <Image
                source={require("../../assets/plus1.png")}
                style={{width: 100, height: 100, backgroundColor: "#ddd", borderRadius: 50, display: "flex", alignSelf: "center"}}
              />
            </View>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                <View>
                  <Text>1</Text>
                  <Text>Due</Text>
                </View>
                <View></View>
                <View>
                    <Text>0</Text>
                    <Text>Signed in</Text>
                </View>
            </View>
        </View>

        <View style={styles.startCardContainer}>
          <View style={styles.startCard}><StatCard title="Users" value={stats.users}/></View>
          <View style={styles.startCard}><StatCard title="Students" value={stats.students} /></View>
          <View style={styles.startCard}><StatCard title="Teachers" value={stats.teachers} /></View>
          <View style={styles.startCard}><StatCard title="Revenue" value={stats.revenue} /></View>
        </View>
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNavContainer}>
        {
          bottomItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.bottomNavItem}
              onPress={() => {
                switch (index) {
                  case 1:
                    navigation.replace("supperchatroom");
                    break;
                  case 2:
                    navigation.replace("adminchildren");
                    break;
                  case 3:
                    navigation.replace("supperlearning");
                    break;
                }
              }}
            >
                <View style={styles.icon}>{item.icon}</View>
                <Text>{item.label}</Text>
            </TouchableOpacity>
          ))
        }
      </View>
    </View>
  );
};

export default SupperAdminScreen;