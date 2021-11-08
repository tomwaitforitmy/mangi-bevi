import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../firebase";
import uuid from "uuid";
import LoadingIndicator from "../components/LoadingIndicator";
import getPictureBlob from "../firebase/getPictureBlob";

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      uploadImageToBucket(result.uri);
    }
  };

  const uploadImageToBucket = async (uri) => {
    let blob;
    try {
      setIsLoading(true);
      blob = await getPictureBlob(uri);

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
