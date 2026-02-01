import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Colors from "../constants/Colors";

const CustomChip = ({ tag, onPress, onLongPress, onIconPress, useIcon }) => {
  const handleIconPress = (e) => {
    e.stopPropagation?.();
    if (onIconPress) {
      onIconPress(tag);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      onPress={() => onPress(tag)}
      onLongPress={() => onLongPress(tag)}>
      <Text style={styles.chipText}>{tag.title}</Text>
      {useIcon && (
        <Pressable onPress={handleIconPress} style={styles.chipIcon}>
          <FontAwesome name="close" size={14} color={Colors.navigationIcon} />
        </Pressable>
      )}
    </Pressable>
  );
};

const TagList = (props) => {
  let useIcon = false;
  if (props.onIconPress) {
    useIcon = true;
  }
  const onIconPressHandler = (tag) => {
    if (useIcon) {
      props.onIconPress(tag);
    } else {
      console.log("icon pressed on " + tag);
    }
  };

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
        <View key={index} style={styles.tag}>
          <CustomChip
            tag={tag}
            onPress={onPressTagHandler}
            onLongPress={onLongPressTagHandler}
            onIconPress={onIconPressHandler}
            useIcon={useIcon}
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
    margin: 3,
  },
  tag: {
    margin: 1,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    color: Colors.navigationIcon,
    fontSize: 14,
    fontWeight: "500",
  },
  chipIcon: {
    padding: 4,
  },
});

export default TagList;
