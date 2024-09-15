import React from "react";
import { StyleSheet, Text } from "react-native";
import { SplitTextToHighlight } from "../common_functions/SplitTextToHighlight";

const HighlightedText = ({ text, searchTerm, highlightColor }) => {
  const ValidSearchTerm = (s) => {
    return s ? true : false;
  };
  const highlightText = ValidSearchTerm(searchTerm);

  if (highlightText) {
    const textSplitted = SplitTextToHighlight(text, searchTerm);

    return (
      //extra text wrapper is needed, because else we get new lines for each text
      <Text style={styles.regularText}>
        {textSplitted.map((x, index) =>
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
        )}
      </Text>
    );
  }

  return <Text style={styles.regularText}>{text}</Text>;
};

const styles = StyleSheet.create({
  regularText: {},
});

export default HighlightedText;
