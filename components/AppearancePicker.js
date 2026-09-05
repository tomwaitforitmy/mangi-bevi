import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { useAppearanceSelection } from "../theme/useAppearanceSelection";
import { LIGHT, DARK, COLORFUL, AUTOMATIC } from "../theme/AppearanceOptions";

const OPTIONS = [
  { value: LIGHT, label: "Light" },
  { value: DARK, label: "Dark" },
  { value: COLORFUL, label: "Colorful" },
  { value: AUTOMATIC, label: "Automatic" },
];

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    option: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surface,
    },
    optionSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    optionText: {
      color: theme.colors.onSurface,
    },
    optionTextSelected: {
      color: theme.colors.onPrimary,
      fontWeight: "bold",
    },
  });

const AppearancePicker = () => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const { selection, setSelection } = useAppearanceSelection();

  return (
    <View style={styles.container} testID="appearance-picker">
      {OPTIONS.map((option) => {
        const isSelected = option.value === selection;
        return (
          <Pressable
            key={option.value}
            testID={`appearance-option-${option.value}`}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => setSelection(option.value)}
          >
            <Text
              style={[styles.optionText, isSelected && styles.optionTextSelected]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default AppearancePicker;
