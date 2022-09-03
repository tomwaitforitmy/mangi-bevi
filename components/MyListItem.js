import React from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import Hyperlink from "react-native-hyperlink";
import Colors from "../constants/Colors";

const MyListItem = (props) => {
  const testIconId = props.title + "-icon";

  return (
    <View style={styles.listItemView}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <Hyperlink linkDefault={true} linkStyle={styles.linkStyle}>
            <ListItem.Title>{props.title}</ListItem.Title>
          </Hyperlink>
        </ListItem.Content>
        {props.IconName && (
          <Icon
            name={props.IconName}
            onPress={props.onPressIcon}
            type={props.iconType}
            testID={testIconId}
          />
        )}
      </ListItem>
    </View>
  );
};

const styles = StyleSheet.create({
  linkStyle: { color: Colors.hyperlink },
  listItemView: {
    marginHorizontal: 10,
    padding: 2,
  },
});

export default MyListItem;
