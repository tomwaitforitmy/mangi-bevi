import React, { memo, useState } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import ReorderableList, {
  reorderItems,
  useReorderableDrag,
} from "react-native-reorderable-list";

const Card = memo(({ title }) => {
  const drag = useReorderableDrag();

  return (
    <Pressable style={[styles.card]} onLongPress={drag}>
      <Text> {title} </Text>
    </Pressable>
  );
});

function DevScreen({ navigation }) {
  const handleReorder = ({ from, to }) => {
    setItems((value) => reorderItems(value, from, to));
  };

  const [items, setItems] = useState([
    "test 1",
    "test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test",
    "test 2",
    "test 3",
  ]);

  const renderItem = ({ item }) => {
    return <Card title={item} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <ReorderableList
        data={items}
        onReorder={handleReorder}
        keyExtractor={(item, index) => index}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
  },
});

export default DevScreen;
