import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip, Icon } from "react-native-elements";

const TagList = (props) => {
  const onIconPress = () => {
    console.log("icon pressed");
  };

  const closeIcon = () => {
    return (
      <Icon
        name="close"
        type="font-awesome"
        size={20}
        color="white"
        onPress={onIconPress}
      ></Icon>
    );
  };

  return (
    <View style={styles.tagsContainer}>
      {props.tags.map((tag) => (
        <View key={Math.random()} style={styles.tag}>
          <Chip
            title={tag}
            icon={closeIcon}
            iconRight
            onPress={() => console.log("pressed tag with" + tag)}
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
