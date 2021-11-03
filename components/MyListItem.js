import React from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, Button, Icon } from "react-native-elements";

const MyListItem = (props) => {
  return (
    <View style={styles.listItemView}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{props.title}</ListItem.Title>
        </ListItem.Content>
        {props.IconName && (
          <Icon name={props.IconName} onPress={props.onPressDelete} />
        )}
      </ListItem>
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
