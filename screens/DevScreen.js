import React, { useState } from "react";
import MovableElementContainer from "../components/MovableElementContainer";
import BulkEditMeal from "../components/BulkEditMeal";
import { ELEMENTS } from "../components/MovableElementContainerConfig";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import Element from "../components/Element";

function DevScreen({ navigation }) {
  const [data, setData] = useState(ELEMENTS);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rowItem,
            { backgroundColor: isActive ? "red" : "blue" },
          ]}
        >
          <Element title={item.title}></Element>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      {/* <MovableElementContainer></MovableElementContainer> */}
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
});

export default DevScreen;
