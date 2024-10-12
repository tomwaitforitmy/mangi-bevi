import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

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

export const getPermission = async () => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
    }
  }
};
