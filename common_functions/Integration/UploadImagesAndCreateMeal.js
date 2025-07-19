import uploadImages from "../../image_processing/uploadImages";
import Meal from "../../models/Meal";

export async function UploadImagesAndCreateMeal(
  urls,
  title,
  ingredients,
  steps,
  author,
  imageUploadTarget,
) {
  let uploadedImages = await uploadImages(urls, imageUploadTarget);
  const now = new Date().toISOString();
  return Meal(
    title,
    "error",
    uploadedImages[0],
    ingredients,
    steps,
    uploadedImages,
    [],
    0,
    author.id,
    now,
    author.id,
    now,
    //no links allowed, yet
  );
}
