import React from "react";
import { StyleSheet, Text } from "react-native";
import { SplitTextToHighlight } from "../common_functions/SplitTextToHighlight";

const HighlightedText = ({ text, searchTerm, highlightColor }) => {
  const highlightText = searchTerm !== undefined;

  if (highlightText) {
    const textSplitted = SplitTextToHighlight(text, searchTerm);

    return textSplitted.map((x, index) =>
      x.toLowerCase() === searchTerm.toLowerCase() ? (
        <Text
          key={index}
          style={{ color: highlightColor ? highlightColor : "red" }}>
          {x}
        </Text>
      ) : (
        <Text key={index} style={styles.regularText}>
          {x}
        </Text>
      ),
    );
  }

  return <Text style={styles.regularText}>{text}</Text>;
};

const styles = StyleSheet.create({
  regularText: {},
});

export default HighlightedText;
