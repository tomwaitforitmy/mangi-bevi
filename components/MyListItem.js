import React from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import HyperLink from "react-native-hyperlink";

const MyListItem = (props) => {
  return (
    <View style={styles.listItemView}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <HyperLink linkDefault={true} linkStyle={{ color: "#2980b9" }}>
            <ListItem.Title>{props.title}</ListItem.Title>
          </HyperLink>
        </ListItem.Content>
        {props.IconName && (
          <Icon name={props.IconName} onPress={props.onPressIcon} />
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
