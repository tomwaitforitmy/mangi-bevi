import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input } from "react-native-elements";
import MyListItem from "./MyListItem";

const InputListViewContainer = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <TouchableOpacity onLongPress={props.onLongPress}>
        <Text style={styles.subtitle}>{props.title}</Text>
        {props.data.map((e) => (
          <MyListItem
            key={e}
            title={e}
            IconName={"edit"}
            onPressIcon={() => props.onPressIcon(e)}
          />
        ))}
      </TouchableOpacity>
      <Input
        placeholder="Enter text"
        ref={props.inputRef}
        onChangeText={(value) => props.onChangeText(value)}
        onBlur={props.onBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  subtitle: {
    fontSize: 18,
    textAlign: "left",
  },
});

export default InputListViewContainer;
