// navigation/CaregiverStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CareGiverScreen from "./CareGiverScreen";


const Stack = createNativeStackNavigator();

const CaregiverStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CaregiverHome" component={CareGiverScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default CaregiverStack;