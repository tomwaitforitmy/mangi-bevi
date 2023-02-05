import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

const MealTableRow = ({ meal, onPress, isSelected }) => {
  const [selected, setSelected] = useState(isSelected);

  const handlePress = () => {
    setSelected(!selected);
    onPress(meal, !selected);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={selected ? styles.rowContainerSelected : styles.rowContainer}>
      <View style={styles.mealImageContainer}>
        <Image
          source={{ uri: meal.primaryImageUrl }}
          style={styles.mealImage}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{meal.title}</Text>
      </View>
      {selected && (
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
    margin: 5,
    borderWidth: 1,
    borderColor: Colors.selectedMealBorderColor,
  },
  rowContainerSelected: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.selectedMealBackground,
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: Colors.second,
  },
  mealImage: {
    width: "100%",
    height: "100%",
  },
  mealImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 8,
    overflow: "hidden",
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

export default MealTableRow;
