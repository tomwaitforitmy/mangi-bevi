import { deleteImageFromAppwrite } from "../appwrite/deleteImageFromAppwrite";

export async function deleteImages(urls, imageUploadTarget) {
  if (urls.length < 1) {
    return;
  }

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
          console.error(
            "Invalid image upload target (delete) " + imageUploadTarget,
          );
        }
      }),
    );
  } catch (error) {
    console.log("error deleting images: " + error);
    throw error;
  }
}

export default deleteImages;
