import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import MealItem from "./MealItem";

const MealList = (props) => {
  const router = useRouter();

  const renderMealItem = (itemData) => {
    return (
      <MealItem
        title={itemData.item.title}
        onSelectMeal={() => {
          const params = {
            mealId: itemData.item.id,
            mealTitle: itemData.item.title,
          };
          if (props.isAuthenticated) {
            router.push({ pathname: "/meals/meal/[mealId]", params });
          } else {
            router.push({ pathname: "/detail/[mealId]", params });
          }
        }}
        image={itemData.item.primaryImageUrl}
        searchTerm={props.searchTerm}
        reactions={itemData.item.reactions}
        isFavorite={props.userFavorites?.includes(itemData.item.id)}
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
