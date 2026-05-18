

// import { PermissionsAndroid, Platform } from "react-native";


// const requestMediaPermission = async (
//   type: "media" | "document" = "media"
// ) => {

//   if (Platform.OS !== "android") {
//     return true;
//   }

//   try {

//     // ANDROID 13+
//     if (Number(Platform.Version) >= 33) {

//       // MEDIA (images/videos)
//       if (type === "media") {

//         const result =
//           await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//           ]);

//         console.log("MEDIA PERMISSION:", result);

//         return (
//           result[
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
//           ] === "granted" &&

//           result[
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
//           ] === "granted"
//         );
//       }

//       // DOCUMENTS
//       if (type === "document") {

//         const result =
//           await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
//           ]);

//         console.log("DOCUMENT PERMISSION:", result);

//         return true;
//       }
//     }

//     // ANDROID 12 AND BELOW
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
//     );

//     console.log("OLD STORAGE RESULT:", granted);

//     return granted === "granted";

//   } catch (error) {

//     console.log("PERMISSION ERROR:", error);

//     return false;
//   }
// };

// export default requestMediaPermission;





import { PermissionsAndroid, Platform } from "react-native";

/**
 * MEDIA + STORAGE PERMISSION HANDLER
 */
const requestMediaPermission = async ( type: "media" | "document" | "storage" = "media") => {
  if (Platform.OS !== "android") return true;

  try {
    const version = Number(Platform.Version);

    // ===============================
    // ANDROID 13+ (API 33+)
    // ===============================
    if (version >= 33) {
      if (type === "media") {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]);

        return (
          result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === "granted" &&
          result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === "granted"
        );
      }

      if (type === "document") {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        ]);

        return Object.values(result).every((v) => v === "granted");
      }

      // STORAGE (for saving to gallery)
      if (type === "storage") {
        // Android 13+ does NOT require WRITE_EXTERNAL_STORAGE
        return true;
      }
    }

    // ===============================
    // ANDROID 12 AND BELOW
    // ===============================
    if (type === "media" || type === "document") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    if (type === "storage") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return false;
  } catch (error) {
    console.log("PERMISSION ERROR:", error);
    return false;
  }
};

export default requestMediaPermission;





