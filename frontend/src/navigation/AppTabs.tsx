
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { tabConfig } from "./tabConfig";
import type { UserRole } from "./types";

const Tab = createBottomTabNavigator();

const AppTabs = ({ role }: { role: UserRole }) => {

  const tabs = tabConfig[role] || [];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",

        tabBarStyle: {
            height: 80,         
            paddingBottom: 10,   
            paddingTop: 10,
        },
      }}
    >

      {tabs.map((tab: any, index: number) => (
        <Tab.Screen
          key={index}
          name={tab.name}
          component={tab.component}

          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} size={size} color={color}
              />
            ),
          }}
        />

      ))}

    </Tab.Navigator>
  );
};

export default AppTabs;