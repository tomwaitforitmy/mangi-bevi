import React, { useEffect } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TagList from "../components/TagList";
import * as tagActions from "../store/actions/tagsAction";
import AndOrTagFilterSwitch from "../components/Switches/AndOrTagFilterSwitch";

function FiltersScreen() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);
  const filterTags = useSelector((state) => state.tags.filterTags);

  const availableFilterTags = useSelector(
    (state) => state.tags.availableFilterTags,
  );

  //Todo: What is this useEffect exactly for?
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
        <TagList tags={filterTags} onPressTag={removeTagHandler} />
        {/* NativeTabs mounts every tab immediately (unlike the old lazy JS
            Tabs), so this can render before MealsScreen's fetchAll() has
            populated the user. AndOrTagFilterSwitch also seeds its switch
            state from the user only on mount, so it must not mount until
            the user is loaded, not just be null-guarded internally. */}
        {user && <AndOrTagFilterSwitch />}
        <Text style={styles.subtitle}>Available Tags</Text>
        <TagList tags={availableFilterTags} onPressTag={addTagHandler} />
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
