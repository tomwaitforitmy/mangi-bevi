import React from "react";
import { StyleSheet, View } from "react-native";
import { Input } from "react-native-elements";

const MyInput = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Input
        onChangeText={props.onChangeText}
        placeholder={props.title ? props.title : "Input text"}
        rightIcon={{ type: "font-awesome", name: "plus" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
});

export default MyInput;
