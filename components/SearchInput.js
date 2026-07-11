import React from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import Colors from "../constants/Colors";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

const SearchInput = ({
  style,
  onChangeText,
  numberOfLabels,
  label,
  showSortIcon,
  onSortPress,
}) => {
  return (
    <View style={[styles.textContainer, style]}>
      <TextInput
        placeholder="Enter text to search 🍕"
        placeholderTextColor={Colors.searchTextPlaceholder}
        onChangeText={onChangeText}
        style={styles.searchTerm}
        autoCorrect={false}
      />
      <Text style={styles.label}>
        {numberOfLabels} {label}
      </Text>
      {showSortIcon && (
        <Pressable onPress={onSortPress} style={styles.icon}>
          <MaterialDesignIcons
            name="sort"
            color={Colors.navigationIcon}
            size={24}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  searchTerm: {
    backgroundColor: Colors.screenBackGround,
    fontSize: 20,
    margin: 3,
    paddingLeft: 15,
    borderRadius: 25,
    color: "black",
    minHeight: 30,
    flex: 1, // Takes the remaining space
  },
  label: {
    color: Colors.white,
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 10,
  },
  icon: {
    //example how to style icon
    // paddingHorizontal: 5,
  },
});

export default SearchInput;
