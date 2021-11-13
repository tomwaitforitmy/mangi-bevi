import { storage } from "../firebase";
import uuid from "uuid";
import getPictureBlob from "../firebase/getPictureBlob";

const uploadImageToBucket = async (uri) => {
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
