// navigation/ParentStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SupperAdminScreen from "./SupperAdminScreen";
import SupperAdminSetting from "./SupperAdminSetting";
import AddUser from "./AddUser";
import ChatRoom from "./ChatRoom";
import AdminChildren from "./AdminChildren";
import AdminLearningScreen from "./AdminLearningScreen";

const Stack = createNativeStackNavigator();

const SupperAdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="supperAdminHome" component={SupperAdminScreen} options={{ headerShown: false }} />
      <Stack.Screen name="supperAdminSetting" component={SupperAdminSetting} options={{ headerShown: false }} />
      <Stack.Screen name="adduser" component={AddUser} options={{ headerShown: false }} />
      <Stack.Screen name="supperchatroom" component={ChatRoom} options={{ headerShown: false }} />
      <Stack.Screen name="adminchildren" component={AdminChildren} options={{ headerShown: false }} />
      <Stack.Screen name="supperlearning" component={AdminLearningScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default SupperAdminStack;