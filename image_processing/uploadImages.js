import { uploadImageToAppwrite } from "../appwrite/uploadImageToAppwrite";

export async function uploadImages(urls, imageUploadTarget) {
  if (urls.length === 0) {
    return [];
  }

  if (imageUploadTarget !== "appwrite") {
    throw new Error("Invalid image upload target " + imageUploadTarget);
  }

  const uploadToAppwrite = async (item) => {
    try {
      const uploadedUrl = await uploadImageToAppwrite(item);
      console.log("image uploaded successfully to appwrite:" + uploadedUrl);
      return uploadedUrl;
    } catch (err) {
      console.log(
        "error uploading image to appwrite: " + item + " error: " + err,
      );
      // Don't silently keep the local uri as a fallback - a meal saved with
      // it looks fine on this device (still in the local cache) but is
      // broken everywhere else. Surface the failure instead so the caller
      // can tell the user to retry.
      throw new Error(
        "Image upload failed. Please try again in a few minutes.",
      );
    }
  };

  // Promise.all preserves input order regardless of completion order, which
  // callers (e.g. UploadImagesAndEditMeal's primaryImageIndex lookup) rely on.
  return Promise.all(urls.map(uploadToAppwrite));
}

export default uploadImages;
