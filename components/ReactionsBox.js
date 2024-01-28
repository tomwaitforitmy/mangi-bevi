import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CountReactions } from "../common_functions/CountReactions";

const ReactionsBox = (props) => {
  const reactionAmounts = CountReactions(props.reactions);
  const getEmojiContent = (reactAmounts) => {
    let content = [];
    const maxIndex = reactAmounts.length < 4 ? reactAmounts.length : 4;
    for (let index = 0; index < maxIndex; index++) {
      const r = reactAmounts[index];
      if (index === 3) {
        content.push(
          <Text style={styles.emoji} key={r.emoji}>
            {"..."}
          </Text>,
        );
        break;
      }
      if (r.amount === 1) {
        content.push(
          <Text style={styles.emoji} key={r.emoji}>
            {r.emoji}
          </Text>,
        );
      } else {
        content.push(
          <Text style={styles.emoji} key={r.emoji}>
            {r.emoji + r.amount}
          </Text>,
        );
      }
    }
    return content;
  };

  return (
    <View style={{ ...styles.container, ...props.style }}>
      {getEmojiContent(reactionAmounts)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  emoji: {
    borderRadius: 11,
    // height: 28, only needed on DevScreen with buttons?
    padding: 5,
    backgroundColor: "lightblue",
    overflow: "hidden",
    margin: 1,
    fontSize: 15,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default ReactionsBox;
