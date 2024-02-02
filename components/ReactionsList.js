import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GetAuthorName } from "../common_functions/GetAuthorName";

const ReactionsList = (props) => {
  const { reactions, users } = props;

  const generateListContent = () => {
    let content = [];
    for (let index = 0; index < props.reactions.length; index++) {
      const r = reactions[index];
      const authorName = GetAuthorName(r.authorId, users);

      content.push(
        <Text style={styles.emoji} key={r.authorId}>
          {authorName + " reacted with " + r.emoji}
        </Text>,
      );
    }
    return content;
  };

  return (
    <View style={{ ...styles.container, ...props.style }}>
      {generateListContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
  emoji: {
    borderRadius: 11,
    padding: 5,
    overflow: "hidden",
    margin: 1,
    fontSize: 15,
  },
});

export default ReactionsList;
