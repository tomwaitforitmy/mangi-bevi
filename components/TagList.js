import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import Colors from "../constants/Colors";

const CustomChip = ({ tag, onPress, onLongPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      onPress={() => onPress(tag)}
      onLongPress={() => onLongPress(tag)}>
      <Text style={styles.chipText}>{tag.title}</Text>
    </Pressable>
  );
};

const TagList = (props) => {
  const onPressTagHandler = (tag) => {
    if (props.onPressTag) {
      props.onPressTag(tag);
    } else {
      console.log("pressed on tag " + tag);
    }
  };

  const onLongPressTagHandler = (tag) => {
    if (props.onLongPressTag) {
      props.onLongPressTag(tag);
    } else {
      console.log("long pressed on tag " + tag);
    }
  };

  return (
    <View style={styles.tagsContainer}>
      {props.tags.map((tag, index) => (
        <View key={index}>
          <CustomChip
            tag={tag}
            onPress={onPressTagHandler}
            onLongPress={onLongPressTagHandler}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    alignItems: "flex-start",
    padding: 3,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 1,
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    color: Colors.navigationIcon,
    fontSize: 14,
  },
});

export default TagList;
