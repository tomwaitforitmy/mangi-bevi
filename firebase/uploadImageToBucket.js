import { storage } from "../firebase";
import uuid from "uuid";
import getPictureBlob from "../firebase/getPictureBlob";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export const uploadImageToBucket = async (uri) => {
  let blob;
  try {
    const compressed = await manipulateAsync(
      uri,
      [{ resize: { height: 2048 } }],
      {
        compress: 0,
        format: SaveFormat.JPEG,
      }
    );

    blob = await getPictureBlob(compressed.uri);

    const ref = await storage.ref().child(uuid.v4());
    const snapshot = await ref.put(blob);

    return await snapshot.ref.getDownloadURL();
  } catch (e) {
    console.log("error uploading image " + e);
    throw e;
  } finally {
    blob.close();
  }
};

export default uploadImageToBucket;
