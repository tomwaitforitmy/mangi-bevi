import { deleteImageFromAppwrite } from "../appwrite/deleteImageFromAppwrite";
import deleteImage from "./deleteImage";

export async function deleteImages(urls, imageUploadTarget) {
  if (urls.length < 1) {
    return;
  }
  const deleteImageFromFirebase = async (item) => {
    await deleteImage(item)
      .then(() => {
        console.log("firebase image deleted successfully " + item);
      })
      .catch((err) => {
        console.log(
          "firebase error deleting image: " + item + " error: " + err,
        );
      });
  };

  const deleteFromAppwrite = async (item) => {
    await deleteImageFromAppwrite(item)
      .then(() => {
        console.log("appwrite image deleted successfully " + item);
      })
      .catch((err) => {
        console.log(
          "appwrite error deleting image: " + item + " error: " + err,
        );
      });
  };

  try {
    await Promise.all(
      urls.map(async (item) => {
        if (imageUploadTarget === "appwrite") {
          await deleteFromAppwrite(item);
        } else {
          await deleteImageFromFirebase(item);
        }
      }),
    );
  } catch (error) {
    console.log("error deleting images: " + error);
    throw error;
  }
}

export default deleteImages;
