import uploadImages from "../../firebase/uploadImages";
import Meal from "../../models/Meal";

export async function UploadImagesAndCreateMeal(
  urls,
  title,
  ingredients,
  steps,
  author,
) {
  let uploadedImages = await uploadImages(urls);
  const now = new Date();
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
