import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import MyButton from "./MyButton";

const MultiSelectList = ({ data, visibleData, onEndSelection, renderItem }) => {
  let showAll = true;
  if (visibleData && data.length !== visibleData.length) {
    showAll = false;
  }

  const isVisible = (id, visibleItems) => {
    if (visibleItems) {
      const visibleIds = visibleItems.map((i) => i.id);
      if (visibleIds.includes(id)) {
        return true;
      }
    }
    return false;
  };

  const renderItemInternal = (item, showAllInternal) => {
    if (showAllInternal) {
      return renderItem(item);
    }
    const showItem = isVisible(item.id, visibleData);

    if (showItem) {
      return renderItem(item);
    }
    return <></>;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => renderItemInternal(item, showAll)}
        keyExtractor={(item) => item.id}
        estimatedItemSize={data.length}
      />
      <View style={styles.button}>
        <MyButton onPress={() => onEndSelection(data)}>
          {"Done selecting"}
        </MyButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  button: {
    padding: 5,
  },
});

export default MultiSelectList;
