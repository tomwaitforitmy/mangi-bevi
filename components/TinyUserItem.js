import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import HighlightedText from "./HighlightedText";

const TinyUserItem = ({ user, onPressUser, searchTerm }) => {
  const isSelectable = onPressUser ? false : true;

  //State here is needed to trigger re-render on press
  //it is not needed to save the bool value
  //This seems to improve performance on Android compared
  //to keeping the state in an array inside the list.
  const [isSelected, setIsSelected] = useState(user.isSelected);

  const onToggleSelect = (m, newSelectedValue) => {
    m.isSelected = newSelectedValue;
    setIsSelected(newSelectedValue);
  };

  return (
    <TouchableOpacity
      onPress={() =>
        isSelectable ? onToggleSelect(user, !isSelected) : onPressUser(user)
      }
      style={
        isSelectable && isSelected
          ? styles.rowContainerSelected
          : styles.rowContainer
      }
      accessibilityRole="button">
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          <HighlightedText text={user.name} searchTerm={searchTerm} />
        </Text>
      </View>
      {isSelectable && isSelected && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedIndicatorText}>🍕</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.selectedMealBorderColor,
  },
  rowContainerSelected: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.selectedMealBackground,
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.second,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  selectedIndicator: {
    backgroundColor: Colors.transparent,
    padding: 5,
  },
  selectedIndicatorText: {
    fontSize: 26,
  },
});

export default TinyUserItem;
