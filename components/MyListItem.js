import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import Hyperlink from "react-native-hyperlink";
import Colors from "../constants/Colors";
import HighlightedText from "./HighlightedText";
import { PreTestSplit } from "../common_functions/SplitTextToHighlight";

const MyListItem = (props) => {
  const testIconId = props.title + "-icon";
  const searchTerm = props.searchTerm;

  const highlightText = PreTestSplit(props.title, searchTerm);

  return (
    <View style={styles.listItemView}>
      <ListItem bottomDivider>
        <ListItem.Content>
          {highlightText ? (
            <ListItem.Title>
              <HighlightedText
                text={props.title}
                searchTerm={searchTerm}
                highlightColor={Colors.searchTermHighlight}
              />
            </ListItem.Title>
          ) : (
            <Hyperlink linkDefault={true} linkStyle={styles.linkStyle}>
              <ListItem.Title>
                <Text>{props.title}</Text>
              </ListItem.Title>
            </Hyperlink>
          )}
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
  markedText: { color: Colors.searchTermHighlight },
  linkStyle: { color: Colors.hyperlink },
  listItemView: {
    marginHorizontal: 10,
    padding: 2,
  },
});

export default MyListItem;
