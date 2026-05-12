
import {  PermissionsAndroid, Platform} from "react-native";



const requestMediaPermission = async () => {

    if (Platform.OS !== "android") {
      return true;
    }

    try {

      // Android 13+
      if (Number(Platform.Version) >= 33) {

        const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ]);

        console.log("PERMISSION RESULT:", result);

        return (
          result[ PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ] === "granted" &&

          result[ PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO ] === "granted"
        );
      }

      // Android 12 and below
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );

      console.log("OLD STORAGE RESULT:", granted);

      return granted === "granted";

    } catch (error) {
      console.log("PERMISSION ERROR:", error);
      return false;
    }
};



export default requestMediaPermission;
