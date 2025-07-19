const appwritePrefix = "https://fra.cloud.appwrite.io";

export const GetImagesToUpload = (images) => {
  return images.filter((url) => !url.startsWith(appwritePrefix));
};

export const GetImagesAlreadyUploaded = (images) => {
  return images.filter((url) => url.startsWith(appwritePrefix));
};
