import React, { useState } from "react";
import MovableElementContainer from "../components/MovableElementContainer";
import BulkEditMeal from "../components/BulkEditMeal";
import { ELEMENTS } from "../components/MovableElementContainerConfig";
import { Text, View, StyleSheet } from "react-native";
import DraggableItemList from "../components/DraggableItemList";

function DevScreen({ navigation }) {
  const [data, setData] = useState(ELEMENTS);
  const onSortEnd = (sortedData) => {
    setData(sortedData);
    console.log(sortedData);
  };

  return (
    <View style={styles.container}>
      <DraggableItemList data={data} onSortEnd={onSortEnd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DevScreen;
