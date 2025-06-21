import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import MealItem from "./MealItem";
import { NAVIGATION_TITLES } from "../constants/NavigationTitles";

const MealList = (props) => {
  const renderMealItem = (itemData) => {
    return (
      <MealItem
        title={itemData.item.title}
        onSelectMeal={() => {
          if (props.isAuthenticated) {
            props.navigation.navigate(NAVIGATION_TITLES.TAB_MEALS, {
              screen: NAVIGATION_TITLES.STACK_MEAL_DETAILS,
              params: {
                mealId: itemData.item.id,
                mealTitle: itemData.item.title,
                isAuthenticated: props.isAuthenticated,
                updateRenderCounter: 0,
              },
            });
          } else {
            props.navigation.navigate(NAVIGATION_TITLES.LOGGED_OUT_DETAILS, {
              mealId: itemData.item.id,
              mealTitle: itemData.item.title,
              isAuthenticated: props.isAuthenticated,
              updateRenderCounter: 0,
            });
          }
        }}
        image={itemData.item.primaryImageUrl}
        searchTerm={props.searchTerm}
        reactions={itemData.item.reactions}
      />
    );
  };

  return (
    <View style={{ ...styles.list, ...props.style }}>
      <FlatList
        refreshControl={props.refreshControl}
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
    width: "99%", //I chose that here, because without the width, the screen was slightly smaller than 100
    backgroundColor: Colors.screenBackGround,
  },
});

export default MealList;
