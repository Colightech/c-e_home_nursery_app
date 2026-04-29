import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../components/LoginScreen";
import SupperAdminStack from "../screens/supperadmin/SupperAdminStack";
import AdminStack from "../screens/admin/AdminStack";
import CaregiverStack from "../screens/caregiver/CaregiverStack";
import ParentStack from "../screens/parent/ParentStack";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
   <NavigationContainer>
      <Stack.Navigator initialRouteName="login">

        <Stack.Screen name="login" component={LoginScreen}  options={{ headerShown: false }} />

        {/* Role dashboards */}
        <Stack.Screen name="supperadmin"  component={SupperAdminStack}  options={{ headerShown: false }}/>

        <Stack.Screen  name="admin"  component={AdminStack}  options={{ headerShown: false }}/>

        <Stack.Screen  name="caregiver"  component={CaregiverStack}  options={{ headerShown: false }}/>

        <Stack.Screen  name="parent"  component={ParentStack}  options={{ headerShown: false }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
