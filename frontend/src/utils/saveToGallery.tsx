

import RNFS from "react-native-fs";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import requestMediaPermission from "../utils/requestMediaPermission";



// detect video or image
const isVideoFile = (path: string) => {
  return (
    path.endsWith(".mp4") ||
    path.endsWith(".mov") ||
    path.endsWith(".avi") ||
    path.includes("video")
  );
};

const saveToGallery = async (path: string) => {
  try {
    const hasPermission = await requestMediaPermission("storage");
    if (!hasPermission) {
      console.log("Permission denied");
      return;
    }

    let finalPath = path;

    // --- DOWNLOAD IF REMOTE OR CONTENT ---
    if (path.startsWith("content://") || path.startsWith("http")) {
      const fileName =
        path.split("/").pop() || `temp_${Date.now()}`;

      const extension =
        fileName.includes(".")
          ? fileName.split(".").pop()
          : isVideoFile(path)
          ? "mp4"
          : "jpg";

      finalPath = `${RNFS.TemporaryDirectoryPath}save_${Date.now()}.${extension}`;

      const downloadResult = await RNFS.downloadFile({
        fromUrl: path,
        toFile: finalPath,
      }).promise;

      if (downloadResult.statusCode !== 200) {
        console.log("Download failed before save");
        return;
      }
    }

    // --- SAVE TO GALLERY (USE FINAL PATH) ---
    const success = await CameraRoll.saveAsset(finalPath, {
        type: isVideoFile(finalPath) ? "video" : "photo",
      });

    if (success) {
      console.log("Saved to gallery ✅");
    } else {
      console.log("Failed to save ❌");
    }
  } catch (err) {
    console.log("SAVE ERROR:", err);

    try {
      const fallback = await CameraRoll.saveAsset(path, {
          type: isVideoFile(path) ? "video" : "photo",
        });

      if (fallback) {
        console.log("Saved via fallback ✅");
      } else {
        console.log("Fallback failed ❌");
      }
    } catch (e) {
      console.log("Final save error:", e);
    }
  }
};

export default saveToGallery;