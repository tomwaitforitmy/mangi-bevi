import React from "react";
import { StyleSheet, Text } from "react-native";

const HighlightedText = ({ text, searchTerm, highlightColor }) => {
  const highlightText = searchTerm !== undefined;
  //escape all special characters, so users can search for ?,. etc.
  const regEscape = (v) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

  if (highlightText) {
    //new RegExp(searchTerm, "i") makes split to match case insensitive
    return text
      .split(new RegExp(regEscape(searchTerm), "i"))
      .map((x, index) => (
        <Text key={index} style={styles.regularText}>
          {/* the way split works, we have to add searchTerm
        split removes the separator (searchTerm)
        since the first subtext x does not contain searchTerm,
        we don't have a to add a highlight there */}
          {index !== 0 && (
            <Text style={{ color: highlightColor ? highlightColor : "red" }}>
              {searchTerm}
            </Text>
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
