import React from "react";
import { StyleSheet, Text } from "react-native";

const HighlightedText = ({ text, searchTerm, highlightColor }) => {
  const highlightText = searchTerm !== undefined;

  if (highlightText) {
    return text.split(searchTerm).map((x, index) => (
      <Text key={index} style={styles.regularText}>
        {/* the way split works, we have to add searchTerm
        split removes the separator (searchTerm)
        since the first subtext x does not contain searchTerm,
        we don't have a to add a highlight there */}
        {index !== 0 && (
          <Text style={{ color: highlightColor }}>{searchTerm}</Text>
        )}
        {x}
      </Text>
    ));
  }

  return <Text style={styles.regularText}>{text}</Text>;
};

const styles = StyleSheet.create({
  regularText: {},
});

export default HighlightedText;
