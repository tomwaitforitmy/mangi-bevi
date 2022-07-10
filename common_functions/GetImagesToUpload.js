const firebasePrefix = "https://firebasestorage";

export const GetImagesToUpload = (images) => {
  return images.filter((url) => !url.startsWith(firebasePrefix));
};
