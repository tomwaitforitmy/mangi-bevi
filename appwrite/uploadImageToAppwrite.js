import { storage } from "./appwriteClient";
import "react-native-get-random-values";
import { v4 } from "uuid";
import imageCompress from "../image_processing/imageCompress";
import { Image } from "react-native";
import Constants from "expo-constants";
import { GetImageSize } from "../image_processing/GetImageSize";

export async function uploadImageToAppwrite(uri) {
  let width = 0,
    height = 0;
  await new Promise((res) =>
    Image.getSize(
      uri,
      (w, h) => ((width = w), (height = h), res()),
      () => res(),
    ),
  );

  const compressedUri = await imageCompress(uri, { width, height });

  const fileId = v4(); //unique name
  const compressedSize = await GetImageSize(compressedUri);

  const fileObj = {
    name: `${fileId}.jpg`,
    type: "image/jpeg",
    size: compressedSize,
    uri: compressedUri,
  };

  try {
    const response = await storage.createFile(
      Constants.expoConfig.extra.appwriteBucketId,
      fileId,
      fileObj,
    );

    // Make sure response exists before accessing $id
    if (!response || !response.$id) {
      throw new Error("Image upload failed: No response or file ID returned");
    }

    //I tried using getFileView, but it returned an empty array
    const url = `${storage.client.config.endpoint}/storage/buckets/${Constants.expoConfig.extra.appwriteBucketId}/files/${response.$id}/view?project=${Constants.expoConfig.extra.appwriteProjectId}`;
    return url;
  } catch (error) {
    console.error("upload failed:", error);
    throw error;
  }
}
