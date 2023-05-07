import { storage } from "./firebase";
//docs for firebase upload https://firebase.google.com/docs/storage/web/upload-files
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import uuid from "uuid";
import imageCompress from "./imageCompress";
import { Image } from "react-native";
import getPictureBlob from "./getPictureBlob";

export const uploadImageToBucket = async (uri) => {
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

    const blob = await getPictureBlob(compressed);
    console.log("Compressed image size ", blob.size / 1048576);

    const imageRef = ref(storage, uuid.v4());

    const snapshot = await uploadBytes(imageRef, blob);
    return await getDownloadURL(snapshot.ref);
  } catch (e) {
    console.log("error uploading image " + e);
    throw e;
  }
};

export default uploadImageToBucket;
