
// import {  PermissionsAndroid, Platform} from "react-native";



// const requestMediaPermission = async () => {

//     if (Platform.OS !== "android") {
//       return true;
//     }

//     try {

//       // Android 13+
//       if (Number(Platform.Version) >= 33) {

//         const result = await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//           ]);

//         console.log("PERMISSION RESULT:", result);

//         return (
//           result[ PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ] === "granted" &&

//           result[ PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO ] === "granted"
//         );
//       }

//       // Android 12 and below
//       const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
//         );

//       console.log("OLD STORAGE RESULT:", granted);

//       return granted === "granted";

//     } catch (error) {
//       console.log("PERMISSION ERROR:", error);
//       return false;
//     }
// };



// export default requestMediaPermission;






import { PermissionsAndroid, Platform } from "react-native";


const requestMediaPermission = async (
  type: "media" | "document" = "media"
) => {

  if (Platform.OS !== "android") {
    return true;
  }

  try {

    // ANDROID 13+
    if (Number(Platform.Version) >= 33) {

      // MEDIA (images/videos)
      if (type === "media") {

        const result =
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ]);

        console.log("MEDIA PERMISSION:", result);

        return (
          result[
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          ] === "granted" &&

          result[
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
          ] === "granted"
        );
      }

      // DOCUMENTS
      if (type === "document") {

        const result =
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          ]);

        console.log("DOCUMENT PERMISSION:", result);

        return true;
      }
    }

    // ANDROID 12 AND BELOW
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
