import React, { memo, useEffect, useRef, useState } from "react";
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
  // Reordering several items in quick succession fires onReorder again
  // before React has committed the previous setData, so handleReorder's
  // `data` closure can be stale -- reorderItems would then be applied on
  // top of an outdated order and silently drop the previous move. A ref
  // updated synchronously on every call sidesteps that race.
  const dataRef = useRef(data);
  // A second, separate race: react-native-reorderable-list re-enables
  // dragging (and will report from/to for the next gesture) the instant
  // onReorder fires, on the UI thread, independent of whether our data
  // prop update below has actually committed into the rendered list. If a
  // new drag starts in that gap, its from/to describe positions in the
  // order still visually on screen (pre-reorder), but we'd apply them on
  // top of dataRef (already post-reorder) -- a mismatch that silently
  // produces the wrong order. Locking dragging out until the effect below
  // confirms our data has committed (it only fires post-commit) closes
  // that window.
  const [dragEnabled, setDragEnabled] = useState(true);

  const handleReorder = ({ from, to }) => {
    setDragEnabled(false);
    const reorderedItems = reorderItems(dataRef.current, from, to);
    dataRef.current = reorderedItems;
    setData(reorderedItems);
    const dataAsArray = reorderedItems.map((item) => item.text);
    props.onSortEnd(dataAsArray);
  };

  useEffect(() => {
    setDragEnabled(true);
  }, [data]);

  const renderItem = ({ item }) => {
    return <Card title={item.text} />;
  };

  return (
    <View style={styles.container}>
      <ReorderableList
        data={data}
        dragEnabled={dragEnabled}
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
