import React from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MovableElementContainer from "../components/MovableElementContainer";
import imageCompress from "../firebase/imageCompress";
import getPictureBlob from "../firebase/getPictureBlob";
import uploadImages from "../firebase/uploadImages";
import * as mealActions from "../store/actions/mealsAction";
import Meal from "../models/Meal";

function DevScreen({ navigation }) {
  const availableMeals = useSelector((state) => state.meals.meals);

  const toEdit = availableMeals;

  const dispatch = useDispatch();

  const compress = async () => {
    await Promise.all(
      toEdit.map(async (m) => {
        let imagesToUpload = [];
        let imagesAlreadyUploaded = [];

        await Promise.all(
          m.imageUrls.map(async (uri) => {
            let blob;
            blob = await getPictureBlob(uri);
            console.log("Uncompressed image size ", blob.size / 1048576);

            if (blob.size / 1048576 > 0.4) {
              console.log("image to compress " + uri);
              imagesToUpload = imagesToUpload.concat(uri);
            } else {
              imagesAlreadyUploaded = imagesAlreadyUploaded.concat(uri);
            }
          })
        );

        console.log("found images to upload " + imagesToUpload.length);

        if (imagesToUpload.length > 0) {
          let uploadedImages = await uploadImages(imagesToUpload);

          //Check if we upload the primary image
          let primarImageIndex = imagesAlreadyUploaded.indexOf(
            m.primaryImageUrl
          );

          const editedMeal = new Meal(
            m.title,
            m.id,
            //if the primary images is uploaded, take it from here
            primarImageIndex != -1 ? m.primaryImageUrl : uploadedImages[0],
            m.ingredients,
            m.steps,
            imagesAlreadyUploaded.concat(uploadedImages),
            m.tags,
            m.rating
          );

          await dispatch(mealActions.editMeal(editedMeal));
        }
      })
    );
  };

  return (
    <View style={styles.container}>
      <Button title="compress" onPress={compress}></Button>
      {/* <MovableElementContainer></MovableElementContainer> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
});

export default DevScreen;
