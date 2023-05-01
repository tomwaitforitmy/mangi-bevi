import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

const HighlightedText = ({ text, searchTerm, containerStyle }) => {
  const renderColor = searchTerm !== undefined;

  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      {renderColor ? (
        text.split(searchTerm).map((x, index) => (
          <Text key={index} style={styles.regularText}>
            {index !== 0 && <Text style={styles.markedText}>{searchTerm}</Text>}
            {x}
          </Text>
        ))
      ) : (
        <Text style={styles.regularText}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  regularText: {},
  markedText: { color: Colors.searchTermHighlight },
  container: {
    flex: 1,
  },
});

export default HighlightedText;
