import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

const MyKeyboardAvoidingView = ({ children, extraOffset, style }) => {
  const headerHeight = useHeaderHeight();

  if (Platform.OS === "ios") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={"padding"}
        //as suggested in many places online the magic 64 seems "ok"
        keyboardVerticalOffset={headerHeight + extraOffset}>
        {children}
      </KeyboardAvoidingView>
    );
  }

  //everything works fine in Android. Do not use the KeyboardAvoidingView
  return <View style={{ ...styles.container, ...style }}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyKeyboardAvoidingView;
