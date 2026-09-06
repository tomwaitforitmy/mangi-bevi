import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ALLOWED_SORTING_OPTIONS } from "../data/AllowedSortingOptions";
import { useAppTheme } from "../theme/useAppTheme";

const SelectSortingBox = ({ style, selectedItem, onItemChanged }) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  return (
    <View style={{ ...styles.container, ...style }}>
      {ALLOWED_SORTING_OPTIONS.map((r) => {
        const selectedReaction = r === selectedItem;
        return (
          <TouchableOpacity key={r} onPress={() => onItemChanged(r)}>
            <Text
              style={[
                styles.item,
                selectedReaction ? styles.selectedItem : styles.item,
              ]}>
              {r}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      borderRadius: 11,
      backgroundColor: theme.colors.surfaceVariant,
    },
    item: {
      padding: 10,
      overflow: "hidden",
      margin: 1,
      fontSize: 20,
      textAlign: "center",
      textAlignVertical: "center",
      color: theme.colors.onSurfaceVariant,
    },
    selectedItem: {
      borderRadius: 11,
      // selectedMealBackground is nearly indistinguishable from
      // surfaceVariant in every theme (a near-1:1 contrast ratio) -- it
      // was designed as a subtle tint elsewhere, not a visible selection
      // indicator. theme.colors.primary reads clearly as "selected" in
      // all three themes.
      backgroundColor: theme.colors.primary,
      color: theme.colors.onPrimary,
    },
  });

export default SelectSortingBox;
