import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import MealItem from "./MealItem";

const MealList = (props) => {
  const renderMealItem = (itemData) => {
    return (
      <MealItem
        title={itemData.item.title}
        onSelectMeal={() => {
          props.navigation.navigate({
            name: "Details",
            params: {
              mealId: itemData.item.id,
              mealTitle: itemData.item.title,
            },
          });
        }}
        image={itemData.item.imageUrl}
      />
    );
  };

  return (
    <View style={{ ...styles.list, ...props.style }}>
      <FlatList
        data={props.mealsList}
        renderItem={renderMealItem}
        style={{ width: "100%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
});

export default MealList;
