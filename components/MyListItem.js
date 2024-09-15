import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Hyperlink from "react-native-hyperlink";
import { Icon } from "react-native-elements";
import Colors from "../constants/Colors";
import HighlightedText from "./HighlightedText";
import { PreTestSplit } from "../common_functions/SplitTextToHighlight";

const MyListItem = (props) => {
  const testIconId = props.title + "-icon";
  const searchTerm = props.searchTerm;

  const highlightText = PreTestSplit(props.title, searchTerm);

  return (
    <View style={styles.listItemView}>
      <View style={styles.listItem}>
        <View style={styles.textContainer}>
          {highlightText ? (
            <HighlightedText
              text={props.title}
              searchTerm={searchTerm}
              highlightColor={Colors.searchTermHighlight}
            />
          ) : (
            <Hyperlink linkDefault={true} linkStyle={styles.linkStyle}>
              <Text style={styles.text}>{props.title}</Text>
            </Hyperlink>
          )}
        </View>
        {props.IconName && (
          <Icon
            name={props.IconName}
            onPress={props.onPressIcon}
            type={props.iconType}
            testID={testIconId}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linkStyle: { color: Colors.hyperlink },
  listItemView: {
    marginHorizontal: 5,
    padding: 2,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
});

export default MyListItem;
