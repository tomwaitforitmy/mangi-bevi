import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

function MyButton({ children, onPress, style }) {
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

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
