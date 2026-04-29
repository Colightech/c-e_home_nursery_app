// navigation/ParentStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ParentScreen from "./ParentScreen";

const Stack = createNativeStackNavigator();

const ParentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ParentHome" component={ParentScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default ParentStack;