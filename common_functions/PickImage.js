import * as ImagePicker from "expo-image-picker";

export const pickImage = async (dispatchFn) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.3,
  });

  if (!result.canceled) {
    dispatchFn(result.assets[0].uri);
  }
};
