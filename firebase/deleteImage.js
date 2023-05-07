import { storage } from "./firebase";
//docs for firebase delete https://firebase.google.com/docs/storage/web/delete-files
import { deleteObject, ref } from "firebase/storage";

export const deleteImage = async (uri) => {
  try {
    const imageRef = ref(storage, uri);

    return await deleteObject(imageRef);
  } catch (e) {
    console.log("error deleting image " + e);
    throw e;
  }
};

export default deleteImage;
