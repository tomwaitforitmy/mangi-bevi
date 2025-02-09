import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ALLOWED_SORTING_OPTIONS } from "../data/AllowedSortingOptions";

const SelectSortingBox = ({ style, selectedItem, onItemChanged }) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      {ALLOWED_SORTING_OPTIONS.map((r) => {
        const selectedReaction = r === selectedItem;
        return (
          <TouchableOpacity key={r} onPress={() => onItemChanged(r)}>
            <Text
              style={[
                styles.item,
                selectedReaction ? styles.selectedItem : styles.item,
              ]}>
              {r}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderRadius: 11,
    backgroundColor: "lightblue",
  },
  item: {
    padding: 10,
    overflow: "hidden",
    margin: 1,
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center",
  },
  selectedItem: {
    borderRadius: 11,
    backgroundColor: "white",
  },
});

export default SelectSortingBox;
