import { useHeaderHeight } from "expo-router/react-navigation";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

const MyKeyboardAvoidingView = ({ children, extraOffset, style }) => {
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      style={{ ...styles.container, ...style }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight + extraOffset}>
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyKeyboardAvoidingView;
