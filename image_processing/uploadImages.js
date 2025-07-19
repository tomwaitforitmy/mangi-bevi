import { uploadImageToAppwrite } from "../appwrite/uploadImageToAppwrite";

export async function uploadImages(urls, imageUploadTarget) {
  const uploadToAppwrite = async (item) =>
    await uploadImageToAppwrite(item)
      .then((uploadedUrl) => {
        console.log("image uploaded successfully to appwrite:" + uploadedUrl);
        uploadedImages = uploadedImages.concat(uploadedUrl);
      })
      .catch((err) => {
        console.log(
          "error uploading image to appwrite: " + item + " error: " + err,
        );
        uploadedImages = uploadedImages.concat(item);
      });

  let uploadedImages = [];
  await Promise.all(
    urls.map(async (item) => {
      if (imageUploadTarget === "appwrite") {
        await uploadToAppwrite(item);
      } else {
        console.error("Invalid image upload target " + imageUploadTarget);
      }
    }),
  );
  return uploadedImages;
}

export default uploadImages;
