// navigation/ParentStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ParentScreen from "./ParentScreen";
import ParentSettingScreen from "./ParentSettingScreen";
import ParentChatListScreen from "./ParentChatListScreen";
import ParentChatScreen from "./ParentChatScreen";
import ParentAttendance from "./ParentAttendance";

const Stack = createNativeStackNavigator();

const ParentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ParentHome" component={ParentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="parentsetting" component={ParentSettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="parentchatlist" component={ParentChatListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="parentchatscreen" component={ParentChatScreen} options={{ headerShown: false }} />
      <Stack.Screen name="parentattendance" component={ParentAttendance} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default ParentStack;