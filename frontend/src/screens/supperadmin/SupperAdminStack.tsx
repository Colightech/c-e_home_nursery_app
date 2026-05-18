// navigation/ParentStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SupperAdminSetting from "./SupperAdminSetting";
import AddUserScreen from "./AddUserScreen";
import ChatRoom from "./ChatRoom";

import AppTabs from "../../navigation/AppTabs";

const Stack = createNativeStackNavigator();

const SupperAdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* BOTTOM TABS */}
      <Stack.Screen name="tabs">
        {() => (
          <AppTabs role="super-admin" />
        )}
      </Stack.Screen>

      <Stack.Screen name="supperAdminSetting" component={SupperAdminSetting} />
      <Stack.Screen name="adduser" component={AddUserScreen}  />
      <Stack.Screen name="chatroom" component={ChatRoom} />
    </Stack.Navigator>
  );
};

export default SupperAdminStack;