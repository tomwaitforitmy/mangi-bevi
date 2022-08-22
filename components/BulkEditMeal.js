import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import getPictureBlob from "../firebase/getPictureBlob";
import uploadImages from "../firebase/uploadImages";
import * as mealActions from "../store/actions/mealsAction";
import Meal from "../models/Meal";

const BulkEditMeal = (props) => {
  const availableMeals = useSelector((state) => state.meals.meals);

  //filter stuff here tommy
  const toEdit = availableMeals;

  const dispatch = useDispatch();

  const bulkEdit = async () => {
    await Promise.all(
      toEdit.map(async (m) => {
        let imagesToUpload = [];
        let imagesAlreadyUploaded = [];

        await findHugeImages();

        async function findHugeImages() {
          await Promise.all(
            m.imageUrls.map(async (uri) => {
              let blob;
              blob = await getPictureBlob(uri);
              console.log("Uncompressed image size ", blob.size / 1048576);
              console.log(uri);

              if (blob.size / 1048576 > 0.4) {
                console.log("image to compress " + uri);
                imagesToUpload = imagesToUpload.concat(uri);
              } else {
                imagesAlreadyUploaded = imagesAlreadyUploaded.concat(uri);
              }
            }),
          );
        }

        console.log(m.title);
        console.log(m.imageUrls.length, "# images");

        console.log("found images to upload " + imagesToUpload.length);

        await compressAndEdit();

        async function compressAndEdit() {
          if (imagesToUpload.length > 0) {
            //Careful with uploading!
            // let uploadedImages = await uploadImages(imagesToUpload);

            //Check if we upload the primary image
            let primaryImageIndex = imagesAlreadyUploaded.indexOf(
              m.primaryImageUrl,
            );

            const editedMeal = new Meal(
              m.title,
              m.id,
              //if the primary images is uploaded, take it from here
              primaryImageIndex != -1 ? m.primaryImageUrl : uploadedImages[0],
              m.ingredients,
              m.steps,
              imagesAlreadyUploaded.concat(uploadedImages),
              m.tags,
              m.rating,
            );

            //Watch out for what is edited before pushing to firebase
            //await dispatch(mealActions.editMeal(editedMeal));
          }
        }
      }),
    );
  };

  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Button title="Compress" onPress={bulkEdit}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BulkEditMeal;
