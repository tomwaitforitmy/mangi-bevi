import { FlashList } from "@shopify/flash-list";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import MultiSelectMealRow from "./MultiSelectMealRow";

const MultiSelectMealsList = ({ meals, onEndSelection }) => {
  return (
    <FlatList
      data={meals}
      renderItem={({ item }) => <MultiSelectMealRow meal={item} />}
      keyExtractor={(item) => item.id}
      estimatedItemSize={meals.length}
    />
  );
};

export default MultiSelectMealsList;
