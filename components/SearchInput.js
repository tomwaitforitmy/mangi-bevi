import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Colors from "../constants/Colors";

const SearchInput = ({ style, onChangeText, numberOfLabels, label }) => {
  return (
    <View style={{ ...styles.textContainer, ...style }}>
      <TextInput
        placeholder="Enter text to search 🍕"
        placeholderTextColor={Colors.searchTextPlaceholder}
        onChangeText={(value) => onChangeText(value)}
        style={styles.searchTerm}
        //auto correct makes it hard to search for uncommon words
        autoCorrect={false}
      />
      <Text
        style={{
          color: Colors.white,
          textAlign: "center",
          textAlignVertical: "center",
          width: "30%",
        }}>
        {numberOfLabels} {label}
      </Text>
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
    width: "70%",
  },
  textContainer: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SearchInput;
