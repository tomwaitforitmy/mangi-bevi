import React, { memo, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MyListItem from "../components/MyListItem";
import Colors from "../constants/Colors";
import IconTypes from "../constants/IconTypes";
import ReorderableList, {
  reorderItems,
  useReorderableDrag,
} from "react-native-reorderable-list";

const Card = memo(({ title }) => {
  const drag = useReorderableDrag();

  return (
    <Pressable style={styles.card} onLongPress={drag}>
      <MyListItem
        title={title}
        IconName={"swap-vertical"}
        iconType={IconTypes.ionicon}
      />
    </Pressable>
  );
});

function DraggableItemList(props) {
  const [data, setData] = useState(props.data);

  const handleReorder = ({ from, to }) => {
    setData((value) => reorderItems(value, from, to));
    props.onSortEnd(data);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.iosSmaller}>
        <Card title={item} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ReorderableList
        data={props.data}
        onReorder={handleReorder}
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
  card: {
    backgroundColor: Colors.screenBackGround,
    width: "100%",
  },
});

export default DraggableItemList;
