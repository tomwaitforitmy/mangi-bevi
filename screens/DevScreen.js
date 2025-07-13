import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button, ScrollView, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteTestMangis } from "../firebase/deleteTestMangis";
import Colors from "../constants/Colors";
import { getPermission, pickImage } from "../common_functions/PickImage";
import { uploadImageToSupabase } from "../supabase/uploadImage";
import { uploadImageToAppwrite } from "../appwrite/uploadImageToAppwrite";

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const [imageUploaded, setImageUploaded] = useState();

  useEffect(() => {
    getPermission();
  }, []);

  const handlePickImageAppwrite = async () => {
    await pickImage(async (uri) => {
      const url = await uploadImageToAppwrite(uri);
      console.log(url);
      setImageUploaded(url);
    });
  };

  const handlePickImageSupabase = async () => {
    await pickImage((uri) => uploadImageToSupabase(uri));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Button
          title="Delete all test mangis"
          onPress={async () => {
            await deleteTestMangis(dispatch, allMeals, user);
          }}
        />
        <Button
          title="supabase"
          onPress={async () => {
            await handlePickImageSupabase();
          }}
        />
        <Button
          title="appwrite"
          onPress={async () => {
            await handlePickImageAppwrite();
          }}
        />
        <Image
          style={styles.image}
          source={{
            uri: imageUploaded,
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", // Aligns input and send button vertically
  },
  image: {
    width: "100%",
    height: 200,
  },
  container: {
    flexGrow: 1,
  },
  input: {
    color: "white",
    backgroundColor: Colors.primary,
    width: "80%",
    minHeight: 60,
    maxHeight: 60,
    marginVertical: 10, // Add some vertical margin for spacing
    fontSize: 20,
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 10, // Inner padding for text input
  },
  sendButtonContainer: {
    width: 40, // Set width and height to the same value for a perfect circle
    height: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    borderRadius: 20, // Half of the width/height for a circle
    marginVertical: 10,
    marginLeft: 5,
  },
  sendButtonText: {
    fontSize: 40, // Large "+"
    color: Colors.white,
    textAlign: "center", // Ensures centering
    textAlignVertical: "center", // For vertical centering on Android
    lineHeight: 42, // Match the button height to vertically center the +
  },
});

export default DevScreen;
