import React, { useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, Switch } from "react-native";
import { Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import TagList from "../components/TagList";
import Colors from "../constants/Colors";
import * as tagActions from "../store/actions/tagsAction";

function FiltersScreen({ navigation }) {
  const dispatch = useDispatch();

  const filterTags = useSelector((state) => state.tags.filterTags);
  const filterMode = useSelector((state) => state.tags.filterMode);
  const filterModeAndIsActive = filterMode === tagActions.FILTER_MODE_AND;

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

  const changeFilterModeHandler = () => {
    if (filterModeAndIsActive) {
      dispatch(tagActions.setFilterModeOr());
    } else {
      dispatch(tagActions.setFilterModeAnd());
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.tagLists}>
        <Text style={styles.subtitle}>Active Tag Filters</Text>
        <Divider />
        <TagList tags={filterTags} onPressTag={removeTagHandler} />
        <View style={styles.filterModeSwitch}>
          {filterModeAndIsActive ? (
            <Text>Combine tags with And</Text>
          ) : (
            <Text>Combine tags with Or</Text>
          )}
          <Switch
            trackColor={{ false: Colors.primary, true: Colors.second }} //track is part in the background
            thumbColor={Colors.white} //thumb is the toggle in the front
            ios_backgroundColor={Colors.primary}
            onValueChange={changeFilterModeHandler}
            value={filterModeAndIsActive}
          />
        </View>
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
  filterModeSwitch: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    width: "100%",
  },
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
