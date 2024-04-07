import uploadImages from "../../firebase/uploadImages";
import Meal from "../../models/Meal";
import {
  GetImagesAlreadyUploaded,
  GetImagesToUpload,
} from "../GetImagesToUpload";

export async function UploadImagesAndEditMeal(
  imageUrls,
  primaryImageUrl,
  title,
  mealId,
  ingredients,
  steps,
  tags,
  rating,
  authorId,
  creationDate,
  editorId,
  editDate,
  links,
  isTestMangi,
  reactions,
) {
  //Upload only the images we haven't uploaded, yet.
  const imagesToUpload = GetImagesToUpload(imageUrls);
  const imagesAlreadyUploaded = GetImagesAlreadyUploaded(imageUrls);

  //Check if we upload the primary image
  let primaryImageIndex = imagesToUpload.indexOf(primaryImageUrl);

  let uploadedImages = await uploadImages(imagesToUpload);

  const editedMeal = new Meal(
    title,
    mealId,
    //if the primary image is uploaded, take it from here
    primaryImageIndex !== -1
      ? uploadedImages[primaryImageIndex]
      : primaryImageUrl,
    ingredients,
    steps,
    imagesAlreadyUploaded.concat(uploadedImages),
    tags,
    rating,
    authorId,
    creationDate,
    editorId,
    editDate,
    links,
    isTestMangi,
    reactions,
  );
  return editedMeal;
}
