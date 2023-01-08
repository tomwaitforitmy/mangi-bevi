import uploadImages from "../../firebase/uploadImages";
import Meal from "../../models/Meal";

export async function UploadImagesAndCreateMeal(
  urls,
  title,
  ingredients,
  steps,
) {
  let uploadedImages = await uploadImages(urls);
  return new Meal(
    title,
    "error",
    uploadedImages[0],
    ingredients,
    steps,
    uploadedImages,
    [],
    0,
  );
}