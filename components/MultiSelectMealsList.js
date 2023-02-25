import { FlashList } from "@shopify/flash-list";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import MultiSelectMealRow from "./MultiSelectMealRow";

const MultiSelectMealsList = ({ meals, onMealPress, selectedMeals }) => {
  const checkIfMealIsSelected = (id, list) => {
    return list && list.includes(id);
  };

  return (
    <FlatList
      data={meals}
      renderItem={({ item }) => (
        <MultiSelectMealRow
          meal={item}
          onPress={onMealPress}
          isSelected={checkIfMealIsSelected(item.id, selectedMeals)}
        />
      )}
      keyExtractor={(item) => item.id}
      estimatedItemSize={meals.length}
    />
  );
};

export default MultiSelectMealsList;
