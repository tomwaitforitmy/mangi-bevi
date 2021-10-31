import React from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, Button } from "react-native-elements";

const MyListItem = (props) => {
  return (
    <View style={styles.listItemView}>
      <ListItem.Swipeable
        bottomDivider
        leftContent={
          <Button
            title="Edit"
            icon={{ name: "edit", color: "white" }}
            buttonStyle={{ minHeight: "100%" }}
          />
        }
        rightContent={
          <Button
            title="Delete"
            icon={{ name: "delete", color: "white" }}
            buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
          />
        }
      >
        <ListItem.Content>
          <ListItem.Title>{props.title}</ListItem.Title>
        </ListItem.Content>
      </ListItem.Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemView: {
    marginHorizontal: 10,
    // borderColor: "#ccc",
    // borderWidth: 1,
  },
});

export default MyListItem;
