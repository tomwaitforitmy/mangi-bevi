import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import MyListItem from "../components/MyListItem";
import Colors from "../constants/Colors";
import IconTypes from "../constants/IconTypes";

function DraggableItemList(props) {
  const renderItem = ({ item, drag, isActive }) => {
    return (
      <View style={styles.iosSmaller}>
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
            ]}>
            <MyListItem
              title={item}
              IconName={"swap-vertical"}
              iconType={IconTypes.ionicon}
            />
          </TouchableOpacity>
        </ScaleDecorator>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList
        canCancelContentTouches={true}
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
  },
  iosSmaller: {
    //render the item smaller to allow scrolling
    width: "90%",
  },
});

export default DraggableItemList;
