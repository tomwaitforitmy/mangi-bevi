import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";

const CustomChip = ({ tag, onPress, onLongPress, styles }) => {
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
  const theme = useAppTheme();
  const styles = getStyles(theme);

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
            styles={styles}
          />
        </View>
      ))}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
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
      backgroundColor: theme.colors.tagBackground,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      margin: 1,
      borderWidth: 1,
      borderColor: theme.colors.tagBorderColor,
    },
    chipSelected: {
      backgroundColor: theme.colors.primary,
    },
    chipPressed: {
      opacity: 0.7,
    },
    chipText: {
      color: theme.colors.tagText,
      fontSize: 14,
    },
  });

export default TagList;
