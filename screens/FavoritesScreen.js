import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../firebase";
import uuid from "uuid";
import LoadingIndicator from "../components/LoadingIndicator";

function FavoritesScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPermission();
  }, []);

  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const getPictureBlob = (uri) => {
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
  };

  const uploadImageToBucket = async () => {
    let blob;
    try {
      setIsLoading(true);
      blob = await getPictureBlob(image);

      const ref = await storage.ref().child(uuid.v4());
      const snapshot = await ref.put(blob);

      return await snapshot.ref.getDownloadURL();
    } catch (e) {
      alert(e.message);
    } finally {
      blob.close();
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.screen}>
      <Text> Favorites not implemented, yet. Push Tommy :)</Text>
      <Button title="Pick Image" onPress={pickImage}></Button>
      <Button title="Upload Image" onPress={uploadImageToBucket}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FavoritesScreen;
