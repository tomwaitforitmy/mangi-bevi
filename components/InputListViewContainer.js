import React from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { Input } from "react-native-elements";
import MyListItem from "./MyListItem";

const InputListViewContainer = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <ScrollView style={styles.scrollList}>
        <TouchableOpacity onLongPress={props.onLongPress}>
          {props.data &&
            props.data.map((e) => (
              <MyListItem
                key={e}
                title={e}
                IconName={"edit"}
                onPressIcon={() => props.onPressIcon(e)}
              />
            ))}
        </TouchableOpacity>
        {/* I would love to move this outside of ScrollView, but when
        I do, the scroll view does not work well with keyboard avoiding view */}
        <Input
          placeholder={"Enter " + props.placeholder}
          ref={props.inputRef}
          onChangeText={(value) => props.onChangeText(value)}
          onBlur={props.onBlur}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollList: {
    flex: 1,
    width: "100%",
  },
});

export default InputListViewContainer;
