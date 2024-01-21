import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CountReactions } from "../common_functions/CountReactions";

const ReactionsBox = (props) => {
  const reactionAmounts = CountReactions(props.reactions);

  console.log(reactionAmounts);

  return (
    <View style={{ ...styles.container, ...props.style }}>
      {reactionAmounts.map((r) => {
        if (r.amount === 1) {
          return <Text key={r.emoji}>{r.emoji}</Text>;
        } else {
          return <Text key={r.emoji}>{r.emoji + r.amount}</Text>;
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ReactionsBox;
