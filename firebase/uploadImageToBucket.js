import { storage } from "./firebase";
import uuid from "uuid";
import getPictureBlob from "../firebase/getPictureBlob";
import imageCompress from "./imageCompress";
import { Image } from "react-native";

export const uploadImageToBucket = async (uri) => {
  let blob;
  try {
    let height;
    let width;
    await Image.getSize(
      uri,
      (h, w) => {
        height = h;
        width = w;
      },
      (error) => {
        console.log(error);
        height = 720;
      },
    );
    const compressed = await imageCompress(uri, { height, width });

    blob = await getPictureBlob(compressed);

    console.log("Compressed image size ", blob.size / 1048576);

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
