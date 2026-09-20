import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/useAppTheme";
import MealItem from "./MealItem";

const MealList = (props) => {
  const router = useRouter();
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();

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
        // NativeTabs' native tab bar overlaps content (edge-to-edge)
        // instead of reserving space for itself like the old JS bottom
        // tabs did, so the last meal in the list otherwise ends up
        // partially hidden underneath it (see MealDetailScreen/NewScreen
        // for the same fix).
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      />
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    list: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 5,
      width: "99%", //I chose that here, because without the width, the screen was slightly smaller than 100
      backgroundColor: theme.colors.screenBackGround,
    },
  });

export default MealList;
