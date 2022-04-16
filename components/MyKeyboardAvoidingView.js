import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

const MyKeyboardAvoidingView = ({ children, extraOffset }) => {
  if (Platform.OS == "ios") {
    //as suggested in many places online adjust the vertical offset with the header height.
    const headerHeight = useHeaderHeight();

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={"padding"}
        //as suggested in many places online the magic 64 seems "ok"
        keyboardVerticalOffset={headerHeight + extraOffset}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  //everything works fine in Android. Do not use the KeyboardAvoidingView
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    width: "100%",
  },
});

export default MyKeyboardAvoidingView;
