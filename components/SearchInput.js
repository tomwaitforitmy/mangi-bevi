import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Colors from "../constants/Colors";
import { Input } from "react-native-elements";

const SearchInput = ({ style, onChangeText }) => {
  return (
    <View style={{ ...styles.textContainer, ...style }}>
      <Input
        placeholder="Enter text"
        onChangeText={(value) => onChangeText(value)}
        style={styles.searchTerm}
        renderErrorMessage={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchTerm: {
    backgroundColor: Colors.screenBackGround,
    fontSize: 18,
    margin: 3,
    paddingLeft: 15,
    borderRadius: 25,
    color: "black",
  },
  textContainer: {
    backgroundColor: Colors.primary,
    width: "100%",
  },
});

export default SearchInput;
