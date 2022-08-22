import uploadImageToBucket from "./uploadImageToBucket";

export async function uploadImages(urls) {
  let uploadedImages = [];
  await Promise.all(
    urls.map(async (item) => {
      await uploadImageToBucket(item)
        .then((uploadedUrl) => {
          console.log("image uploaded successfully " + uploadedUrl);
          uploadedImages = uploadedImages.concat(uploadedUrl);
        })
        .catch((err) => {
          console.log("error uploading image: " + item + " error: " + err);
          uploadedImages = uploadedImages.concat(item);
        });
    }),
  );
  return uploadedImages;
}

export default uploadImages;
