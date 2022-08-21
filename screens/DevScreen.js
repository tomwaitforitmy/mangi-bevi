import React, { useState } from "react";
import MovableElementContainer from "../experiments/MoveableElementContainer-Components/MovableElementContainer";
import BulkEditMeal from "../components/BulkEditMeal";
import { ELEMENTS } from "../experiments/MoveableElementContainer-Components/MovableElementContainerConfig";
import { Text, View, StyleSheet } from "react-native";
import DraggableItemList from "../components/DraggableItemList";
import { useSelector } from "react-redux";
import { ConvertArrayToArrayOfObjects } from "../common_functions/ConvertArrayToArrayOfObjects";

function DevScreen({ navigation }) {
  const id = "-N93DNXIQFETNW8zh5iV";
  const inputMeal = useSelector((state) =>
    state.meals.meals.find((m) => m.id === id)
  );

  const myArray = ["Cheese", "Tomatoes", "Water"];
  const initialData = ConvertArrayToArrayOfObjects(inputMeal.ingredients);

  const [inputData, setInputData] = useState(inputMeal.ingredients);
  const onSortEnd = (sortedData) => {
    setInputData(sortedData);
  };

  return (
    <View style={styles.container}>
      <DraggableItemList data={inputData} onSortEnd={onSortEnd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DevScreen;
