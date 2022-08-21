import React from "react";
import { StyleSheet, View } from "react-native";
import DraggableItemList from "./DraggableItemList";
import MyButton from "./MyButton";

const SortingListViewContainer = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <View style={styles.button}>
        <MyButton onPress={props.onPressDoneSorting}>{"Done sorting"}</MyButton>
      </View>
      <View style={styles.draggableList}>
        <DraggableItemList data={props.data} onSortEnd={props.onSortEnd} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: { padding: 5 },
  draggableList: { flex: 1, marginTop: 5 },
});

export default SortingListViewContainer;
