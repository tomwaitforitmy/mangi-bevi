import React from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import Linkify from "react-native-linkify";

const MyListItem = (props) => {
  return (
    <View style={styles.listItemView}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <Linkify linkDefault={true} linkStyle={styles.linkStyle}>
            <ListItem.Title>{props.title}</ListItem.Title>
          </Linkify>
        </ListItem.Content>
        {props.IconName && (
          <Icon
            name={props.IconName}
            onPress={props.onPressIcon}
            type={props.iconType}
          />
        )}
      </ListItem>
    </View>
  );
};

const styles = StyleSheet.create({
  linkStyle: { color: "#2980b9" },
  listItemView: {
    marginHorizontal: 10,
    padding: 2,
  },
});

export default MyListItem;
