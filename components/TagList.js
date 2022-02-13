import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip, Icon } from "react-native-elements";

const TagList = (props) => {
  const onIconPress = (tag) => {
    if (props.onIconPress) {
      props.onIconPress(tag);
    } else {
      console.log("icon pressed on " + tag);
    }
  };

  const closeIcon = (tag) => {
    return (
      <Icon
        name="close"
        type="font-awesome"
        size={20}
        color="white"
        onPress={() => onIconPress(tag)}
      ></Icon>
    );
  };

  return (
    <View style={styles.tagsContainer}>
      {props.tags.map((tag) => (
        <View key={Math.random()} style={styles.tag}>
          <Chip
            title={tag}
            icon={closeIcon(tag)}
            iconRight
            onPress={() => props.onPressTag(tag)}
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
