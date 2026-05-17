
import RNFS from "react-native-fs";
import { Platform, PermissionsAndroid } from "react-native";


const requestStoragePermission = async () => {
  if (Platform.OS !== "android") return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};



const downloadMedia = async (url: string) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    const fileName = url.split("/").pop() || `file_${Date.now()}.mp4`;

    const path =
      RNFS.DownloadDirectoryPath + "/" + fileName;

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: path,
    }).promise;

    if (result.statusCode === 200) {
      console.log("Downloaded to:", path);
    } else {
      console.log("Download failed");
    }
  } catch (err) {
    console.log("DOWNLOAD ERROR:", err);
  }
};


export default downloadMedia;

