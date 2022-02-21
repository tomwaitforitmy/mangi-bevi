import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip, Icon } from "react-native-elements";

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

  const closeIcon = (tag) => {
    if (useIcon) {
      return (
        <Icon
          name="close"
          type="font-awesome"
          size={20}
          color="white"
          onPress={() => onIconPressHandler(tag)}
        ></Icon>
      );
    }
  };

  return (
    <View style={styles.tagsContainer}>
      {props.tags.map((tag) => (
        <View key={Math.random()} style={styles.tag}>
          <Chip
            title={tag.title}
            icon={closeIcon(tag)}
            iconRight
            onPress={() => onPressTagHandler(tag)}
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
});

export default TagList;
