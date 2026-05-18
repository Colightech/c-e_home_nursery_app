// navigation/ParentStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ParentSettingScreen from "./ParentSettingScreen";
import ParentChatScreen from "./ParentChatScreen";

import AppTabs from "../../navigation/AppTabs";


const Stack = createNativeStackNavigator();

const ParentStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* BOTTOM TABS */}
      <Stack.Screen name="tabs">
        {() => (
          <AppTabs role="parent" />
        )}
      </Stack.Screen>

      <Stack.Screen name="parentsetting" component={ParentSettingScreen} />
      <Stack.Screen name="parentchatscreen" component={ParentChatScreen} />
    </Stack.Navigator>
  );
};

export default ParentStack;