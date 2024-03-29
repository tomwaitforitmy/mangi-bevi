import React from "react";
import { StyleSheet, View } from "react-native";
import DraggableItemList from "./DraggableItemList";
import MyButton from "./MyButton";

const SortingListViewContainer = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <View style={styles.draggableList}>
        <DraggableItemList data={props.data} onSortEnd={props.onSortEnd} />
      </View>
      <View style={styles.button}>
        <MyButton onPress={props.onPressDoneSorting}>{"Done sorting"}</MyButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
  button: { padding: 5 },
  draggableList: { flex: 1 },
});

export default SortingListViewContainer;
