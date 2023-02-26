import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/Colors";
import * as tagActions from "../store/actions/tagsAction";

const FilterModeSwitch = (props) => {
  const dispatch = useDispatch();
  const filterMode = useSelector((state) => state.tags.filterMode);
  const filterModeAndIsActive = filterMode === tagActions.FILTER_MODE_AND;

  const changeFilterModeHandler = () => {
    if (filterModeAndIsActive) {
      dispatch(tagActions.setFilterModeOr());
    } else {
      dispatch(tagActions.setFilterModeAnd());
    }
  };

  return (
    <View style={{ ...styles.filterModeSwitch, ...props.style }}>
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
  );
};

const styles = StyleSheet.create({
  container: {},
  filterModeSwitch: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    width: "100%",
  },
});

export default FilterModeSwitch;
