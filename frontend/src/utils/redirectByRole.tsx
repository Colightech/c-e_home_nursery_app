import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const redirectByRole = (role: string, navigation: NavigationProp) => {
  switch (role) {
    case "super-admin":
      navigation.replace("supperadmin");
      break;
    case "admin":
      navigation.replace("admin");
      break;
    case "caregiver":
      navigation.replace("caregiver");
      break;
    case "parent":
      navigation.replace("parent");
      break;
    default:
      navigation.replace("login");
  }
};


