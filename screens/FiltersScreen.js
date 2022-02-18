import React from "react";
import { StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { TAGS } from "../data/DummyTags";
import Tag from "../models/Tag";
import * as tagActions from "../store/actions/tagsAction";

function FiltersScreen({ navigation }) {
  const dispatch = useDispatch();

  const addTagsHandler = () => {
    TAGS.forEach((tag) => {
      const myTag = new Tag("nix", tag);

      try {
        dispatch(tagActions.createTag(myTag));
      } catch (error) {
        console.log(error.message);
      } finally {
        console.log("finally");
      }
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Button title={"add tags"} onPress={addTagsHandler}></Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FiltersScreen;
