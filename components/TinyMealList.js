import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import TinyMealItem from "./TinyMealItem";

const TinyMealList = ({ meals, style, onPressMeal }) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      <FlatList
        data={meals}
        renderItem={({ item }) => (
          <TinyMealItem meal={item} onPressMeal={onPressMeal} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default TinyMealList;
