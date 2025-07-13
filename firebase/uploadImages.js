import { uploadImageToAppwrite } from "../appwrite/uploadImageToAppwrite";
import uploadImageToBucket from "./uploadImageToBucket";

export async function uploadImages(urls, imageUploadTarget) {
  const uploadToFirebase = async (item) =>
    await uploadImageToBucket(item)
      .then((uploadedUrl) => {
        console.log("image uploaded successfully to firebase:" + uploadedUrl);
        uploadedImages = uploadedImages.concat(uploadedUrl);
      })
      .catch((err) => {
        console.log(
          "error uploading image to firebase: " + item + " error: " + err,
        );
        uploadedImages = uploadedImages.concat(item);
      });

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
        await uploadToFirebase(item);
      }
    }),
  );
  return uploadedImages;
}

export default uploadImages;
