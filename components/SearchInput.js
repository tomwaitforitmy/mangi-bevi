import React from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

const SearchInput = ({
  style,
  onChangeText,
  numberOfLabels,
  label,
  showSortIcon,
  onSortPress,
}) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.textContainer, style]}>
      <TextInput
        placeholder="Enter text to search 🍕"
        placeholderTextColor={theme.colors.searchTextPlaceholder}
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
            color={theme.colors.navigationIcon}
            size={24}
          />
        </Pressable>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    textContainer: {
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 5,
    },
    searchTerm: {
      backgroundColor: theme.colors.screenBackGround,
      fontSize: 20,
      margin: 3,
      paddingLeft: 15,
      borderRadius: 25,
      color: theme.colors.onBackground,
      minHeight: 30,
      flex: 1, // Takes the remaining space
    },
    label: {
      color: theme.colors.white,
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
