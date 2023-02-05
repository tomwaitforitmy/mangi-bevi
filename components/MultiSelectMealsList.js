import { FlashList } from "@shopify/flash-list";
import React from "react";
import MultiSelectMealRow from "./MultiSelectMealRow";

const MultiSelectMealsList = ({ meals, onMealPress, selectedMeals }) => {
  return (
    <FlashList
      data={meals}
      renderItem={({ item }) => (
        <MultiSelectMealRow
          meal={item}
          onPress={onMealPress}
          isSelected={selectedMeals.includes(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      estimatedItemSize={meals.length}
    />
  );
};

export default MultiSelectMealsList;
