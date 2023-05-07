import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Colors from "../constants/Colors";

const SearchInput = ({ style, onChangeText }) => {
  return (
    <View style={{ ...styles.textContainer, ...style }}>
      <TextInput
        placeholder="Enter text for profit 🍕"
        placeholderTextColor={Colors.searchTextPlaceholder}
        onChangeText={(value) => onChangeText(value)}
        style={styles.searchTerm}
        //auto correct makes it hard to search for uncommon words
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchTerm: {
    backgroundColor: Colors.screenBackGround,
    fontSize: 20,
    margin: 3,
    paddingLeft: 15,
    borderRadius: 25,
    color: "black",
    minHeight: 30,
  },
  textContainer: {
    backgroundColor: Colors.primary,
    width: "100%",
  },
});

export default SearchInput;
