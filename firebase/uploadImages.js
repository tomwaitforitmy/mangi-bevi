import uploadImageToBucket from "./uploadImageToBucket";

export async function uploadImages(urls) {
  let uploadedImages = [];
  await Promise.all(
    urls.map(async (item) => {
      await uploadImageToBucket(item)
        .then((uploadedUrl) => {
          console.log("image uploaded successfuly " + uploadedUrl);
          uploadedImages = uploadedImages.concat(uploadedUrl);
        })
        .catch((err) => {
          console.log("error uploading image: " + item + " error: " + err);
          uploadedImages = uploadedImages.concat(
            "https://dummyimage.com/300x200&text=No+image+reinhold+messner"
          );
        });
    })
  );
  return uploadedImages;
}

export default uploadImages;
