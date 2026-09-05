import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAppTheme } from "../theme/useAppTheme";

function MyButton({ children, onPress, style }) {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  return (
    <Pressable
      style={({ pressed }) => [
        { ...styles.button, ...style },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button">
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default MyButton;

const getStyles = (theme) =>
  StyleSheet.create({
    button: {
      borderRadius: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.primary,
      elevation: 2,
      shadowColor: "black",
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      marginTop: 4,
    },
    pressed: {
      opacity: 0.7,
    },
    buttonText: {
      textAlign: "center",
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
