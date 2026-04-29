// navigation/AdminStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminScreen from "./AdminScreen";


const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminHome" component={AdminScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AdminStack;