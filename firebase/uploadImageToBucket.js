import { storage } from "../firebase";
import uuid from "uuid";
import getPictureBlob from "../firebase/getPictureBlob";

export const uploadImageToBucket = async (uri) => {
  if (!uri) {
    return "https://dummyimage.com/300x200&text=No+image+reinhold+messner";
  }
  let blob;
  try {
    blob = await getPictureBlob(uri);

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
