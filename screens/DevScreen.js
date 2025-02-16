import React, { memo, useRef, useState } from "react";
import { StyleSheet, View, Button, ScrollView, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteTestMangis } from "../firebase/deleteTestMangis";
import Colors from "../constants/Colors";
import SortingListViewContainer from "../components/SortingListViewContainer";
import ReorderableList, {
  reorderItems,
  useReorderableDrag,
} from "react-native-reorderable-list";
import MyListItem from "../components/MyListItem";
import IconTypes from "../constants/IconTypes";

const Card = memo(({ title }) => {
  const drag = useReorderableDrag();

  return (
    <Pressable style={[styles.card]} onLongPress={drag}>
      <MyListItem
        title={title}
        IconName={"swap-vertical"}
        iconType={IconTypes.ionicon}
      />
    </Pressable>
  );
});

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const handleReorder = ({ from, to }) => {
    setItems((value) => reorderItems(value, from, to));
  };

  const [items, setItems] = useState([
    "test 1",
    "test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test",
    "test 2",
    "test 3",
  ]); // State to store the list of inputs

  const renderItem = ({ item }) => {
    return (
      <View style={styles.iosSmaller}>
        <Card title={item} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <SortingListViewContainer onSortEnd={handleReorder} data={items} /> */}

      <ReorderableList
        data={items}
        onReorder={handleReorder}
        keyExtractor={(item, index) => index}
        renderItem={renderItem}
        shouldUpdateActiveItem
      />

      <Button
        title="Delete all test mangis"
        onPress={async () => {
          await deleteTestMangis(dispatch, allMeals, user);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", // Aligns input and send button vertically
  },
  container: {
    flexGrow: 1,
  },
  input: {
    color: "white",
    backgroundColor: Colors.primary,
    width: "80%",
    minHeight: 60,
    maxHeight: 60,
    marginVertical: 10, // Add some vertical margin for spacing
    fontSize: 20,
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 10, // Inner padding for text input
  },
  sendButtonContainer: {
    width: 40, // Set width and height to the same value for a perfect circle
    height: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    borderRadius: 20, // Half of the width/height for a circle
    marginVertical: 10,
    marginLeft: 5,
  },
  sendButtonText: {
    fontSize: 40, // Large "+"
    color: Colors.white,
    textAlign: "center", // Ensures centering
    textAlignVertical: "center", // For vertical centering on Android
    lineHeight: 42, // Match the button height to vertically center the +
  },
});

export default DevScreen;
