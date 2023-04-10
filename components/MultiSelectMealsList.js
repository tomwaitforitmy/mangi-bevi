import { FlashList } from "@shopify/flash-list";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import TinyMealItem from "./TinyMealItem";
import { StyleSheet, View } from "react-native";
import MyButton from "./MyButton";

const MultiSelectMealsList = ({ meals, onEndSelection }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        renderItem={({ item }) => <TinyMealItem meal={item} />}
        keyExtractor={(item) => item.id}
        estimatedItemSize={meals.length}
      />
      <View style={styles.button}>
        <MyButton onPress={() => onEndSelection(meals)}>
          {"Done selecting"}
        </MyButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  button: {
    padding: 5,
  },
});

export default MultiSelectMealsList;
