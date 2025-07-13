export const GetImageSize = async (imageUri) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  return blob.size;
};
