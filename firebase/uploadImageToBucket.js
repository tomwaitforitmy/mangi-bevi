import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import uuid from "uuid";
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

    console.log("Compressed image size ", blob.size / 1048576);

    const imageRef = ref(storage, uuid.v4());

    console.log("Created ref", imageRef);

    uploadBytes(imageRef, compressed).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        return downloadURL;
      });
    });
  } catch (e) {
    console.log("error uploading image " + e);
    throw e;
  } finally {
    blob.close();
  }
};

export default uploadImageToBucket;
