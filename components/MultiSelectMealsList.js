import { FlashList } from "@shopify/flash-list";
import React from "react";
import MealTableRow from "./MealTableRow";

const MultiSelectMealsList = ({ meals, onMealPress, selectedMeals }) => {
  return (
    <FlashList
      data={meals}
      renderItem={({ item }) => (
        <MealTableRow
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
