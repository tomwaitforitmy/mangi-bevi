import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import MyListItem from "../components/MyListItem";
import Colors from "../constants/Colors";

function DraggableItemList(props) {
  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator activeScale={1.05}>
        <TouchableOpacity
          onPressIn={drag}
          disabled={isActive}
          style={[
            {
              zIndex: isActive ? 1 : 0,
              backgroundColor: Colors.screenBackGround,
              width: "100%",
            },
          ]}
        >
          <MyListItem title={item} IconName={"edit"}></MyListItem>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={props.data}
        onDragEnd={({ data }) => props.onSortEnd(data)}
        keyExtractor={(item, index) => index}
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

export default DraggableItemList;
