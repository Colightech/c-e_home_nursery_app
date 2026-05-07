// navigation/ParentStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SupperAdminScreen from "./SupperAdminScreen";
import SupperAdminSetting from "./SupperAdminSetting";
import AddUserScreen from "./AddUserScreen";
import ChatRoom from "./ChatRoom";
import AdminChildren from "./AdminChildren";
import SupperAdminAttendance from "./SupperAdminAttendance";
import ChatListScreen from "./ChatListScreen";

const Stack = createNativeStackNavigator();

const SupperAdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="supperAdminHome" component={SupperAdminScreen} options={{ headerShown: false }} />
      <Stack.Screen name="supperAdminSetting" component={SupperAdminSetting} options={{ headerShown: false }} />
      <Stack.Screen name="adduser" component={AddUserScreen} options={{ headerShown: false }} />
       <Stack.Screen name="chatlistscreen" component={ChatListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="chatroom" component={ChatRoom} options={{ headerShown: false }} />
      <Stack.Screen name="adminchildren" component={AdminChildren} options={{ headerShown: false }} />
      <Stack.Screen name="supperattendance" component={SupperAdminAttendance} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default SupperAdminStack;