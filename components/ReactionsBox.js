import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CountReactions } from "../common_functions/CountReactions";

const ReactionsBox = (props) => {
  const reactionAmounts = CountReactions(props.reactions);

  return (
    <View style={{ ...styles.container, ...props.style }}>
      {reactionAmounts.map((r) => {
        if (r.amount === 1) {
          return (
            <Text style={styles.emoji} key={r.emoji}>
              {r.emoji}
            </Text>
          );
        } else {
          return (
            <Text style={styles.emoji} key={r.emoji}>
              {r.emoji + r.amount}
            </Text>
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  emoji: {
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 15,
    height: 28,
    padding: 5,
    backgroundColor: "lightblue",
    overflow: "hidden",
    margin: 1,
  },
});

export default ReactionsBox;
