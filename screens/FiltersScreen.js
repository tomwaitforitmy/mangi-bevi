import React, { useEffect } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import TagList from "../components/TagList";
import * as tagActions from "../store/actions/tagsAction";

function FiltersScreen({ navigation }) {
  const dispatch = useDispatch();

  const filterTags = useSelector((state) => state.tags.filterTags);
  const availableFilterTags = useSelector(
    (state) => state.tags.availableFilterTags,
  );

  useEffect(() => {
    dispatch(tagActions.setFilterTags([]));
  }, [dispatch]);

  const addTagHandler = (tag) => {
    dispatch(tagActions.addFilterTag(tag));
  };

  const removeTagHandler = (tag) => {
    dispatch(tagActions.removeFilterTag(tag));
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.tagLists}>
        <Text style={styles.subtitle}>Active Tag Filters</Text>
        <Divider />
        <TagList
          tags={filterTags}
          onPressTag={removeTagHandler}
          // onLongPressTag={deleteTagHandler}
        />
        <Text style={styles.subtitle}>Available Tags</Text>
        <Divider />
        <TagList
          tags={availableFilterTags}
          onPressTag={addTagHandler}
          // onLongPressTag={deleteTagHandler}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 5,
    width: "100%",
  },
  subtitle: {
    fontSize: 22,
    textAlign: "center",
    color: "grey",
  },
});

export default FiltersScreen;
