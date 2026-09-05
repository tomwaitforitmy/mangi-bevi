import React, { memo, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MyListItem from "../components/MyListItem";
import { useAppTheme } from "../theme/useAppTheme";
import IconTypes from "../constants/IconTypes";
import ReorderableList, {
  reorderItems,
  useReorderableDrag,
} from "react-native-reorderable-list";

const Card = memo(({ title }) => {
  const drag = useReorderableDrag();
  const theme = useAppTheme();
  const styles = getStyles(theme);

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
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const listWithIds = props.data.map((text, index) => ({
    id: index,
    text: text,
  }));

  const [data, setData] = useState(listWithIds);

  const handleReorder = ({ from, to }) => {
    const reorderedItems = reorderItems(data, from, to);
    setData(reorderedItems);
    const dataAsArray = reorderedItems.map((item) => item.text);
    props.onSortEnd(dataAsArray);
  };

  const renderItem = ({ item }) => {
    return <Card title={item.text} />;
  };

  return (
    <View style={styles.container}>
      <ReorderableList
        data={data}
        onReorder={handleReorder}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      backgroundColor: theme.colors.screenBackGround,
      width: "100%",
    },
  });

export default DraggableItemList;
