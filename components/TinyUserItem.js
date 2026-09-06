import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import HighlightedText from "./HighlightedText";

const TinyUserItem = ({ user, onPressUser, searchTerm }) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const isSelectable = onPressUser ? false : true;

  //State here is needed to trigger re-render on press
  //it is not needed to save the bool value
  //This seems to improve performance on Android compared
  //to keeping the state in an array inside the list.
  const [isSelected, setIsSelected] = useState(user.isSelected);

  const onToggleSelect = (m, newSelectedValue) => {
    m.isSelected = newSelectedValue;
    setIsSelected(newSelectedValue);
  };

  return (
    <TouchableOpacity
      onPress={() =>
        isSelectable ? onToggleSelect(user, !isSelected) : onPressUser(user)
      }
      style={
        isSelectable && isSelected
          ? styles.rowContainerSelected
          : styles.rowContainer
      }
      accessibilityRole="button">
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          <HighlightedText
            text={user.name}
            searchTerm={searchTerm}
            highlightColor={theme.colors.searchTermHighlight}
          />
        </Text>
      </View>
      {isSelectable && isSelected && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedIndicatorText}>🍕</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.white,
      padding: 5,
      marginLeft: 5,
      marginRight: 5,
      marginTop: 5,
      borderWidth: 1,
      borderColor: theme.colors.selectedMealBorderColor,
    },
    rowContainerSelected: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.selectedMealBackground,
      padding: 5,
      marginLeft: 5,
      marginRight: 5,
      marginTop: 5,
      borderWidth: 1,
      borderColor: theme.colors.second,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      color: theme.colors.black,
    },
    selectedIndicator: {
      backgroundColor: theme.colors.transparent,
      padding: 5,
    },
    selectedIndicatorText: {
      fontSize: 26,
    },
  });

export default TinyUserItem;
