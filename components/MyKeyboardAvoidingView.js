import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

const MyKeyboardAvoidingView = ({ children }) => {
  // if (Platform.OS == "ios") {
  //as suggested in many places online adjust the vertical offset with the header height.
  const headerHeight = useHeaderHeight();
  const behavior = Platform.OS === "ios" ? "padding" : "height";
  console.log("use height: " + headerHeight);
  console.log("behavior: " + behavior);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={behavior}
        keyboardVerticalOffset={headerHeight}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
  // }

  //everything works fine in Android. Do not use the KeyboardAvoidingView
  // return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // width: "100%",
  },
});

export default MyKeyboardAvoidingView;
