import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Colors from "../constants/Colors";
import { Icon } from "react-native-elements";
import IconTypes from "../constants/IconTypes";

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
          width: "25%",
        }}>
        {numberOfLabels} {label}
      </Text>
      <Icon
        name={"sort"}
        onPress={() => console.log("hi")}
        type={IconTypes.materialCommunityIcons}
        color={Colors.navigationIcon}
        style={{ width: "10%" }}
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
    width: "65%",
  },
  textContainer: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SearchInput;
