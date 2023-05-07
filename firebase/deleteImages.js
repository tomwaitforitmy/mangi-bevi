import deleteImage from "./deleteImage";

export async function deleteImages(urls) {
  if (urls.length < 1) {
    return;
  }
  try {
    await Promise.all(
      urls.map(async (item) => {
        await deleteImage(item)
          .then(() => {
            console.log("image deleted successfully " + item);
          })
          .catch((err) => {
            console.log("error deleting image: " + item + " error: " + err);
          });
      }),
    );
  } catch (error) {
    console.log("error deleting images: " + error);
    throw error;
  }
}

export default deleteImages;
