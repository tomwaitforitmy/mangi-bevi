import { storage } from "./appwriteClient";
import "react-native-get-random-values";
import { v4 } from "uuid";
import imageCompress from "../image_processing/imageCompress";
import { Image } from "react-native";
import Constants from "expo-constants";

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

  // Appwrite's SDK appends `file` straight into FormData. Expo's global
  // fetch/FormData patch (expo/src/winter/FormData.ts normalizeArgs) only
  // recognizes strings and real Blob instances - a plain {uri,name,type}
  // object passes through unconverted and later fails multipart
  // serialization with "Unsupported FormDataPart implementation". So build
  // a real Blob instead. Don't use `File`: its `.name` is a getter-only
  // prototype accessor and Expo's patch tries to reassign `.name`, which
  // throws for File but not for a plain Blob with an own `.name` property.
  const rawBlob = await (await fetch(compressedUri)).blob();
  const file = new Blob([rawBlob], { type: "image/jpeg" });
  file.name = `${fileId}.jpg`;

  try {
    const response = await storage.createFile({
      bucketId: Constants.expoConfig.extra.appwriteBucketId,
      fileId,
      file,
    });

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
