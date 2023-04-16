import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Colors from "../constants/Colors";

const SearchInput = ({ style, onChangeText }) => {
  return (
    <View style={{ ...styles.textContainer, ...style }}>
      <TextInput
        placeholder="Enter text"
        onChangeText={(value) => onChangeText(value)}
        style={styles.searchTerm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchTerm: {
    backgroundColor: Colors.screenBackGround,
    fontSize: 14,
    margin: 5,
    paddingLeft: 10,
    borderRadius: 25,
    color: "black",
  },
  textContainer: {
    backgroundColor: Colors.primary,
  },
});

export default SearchInput;
