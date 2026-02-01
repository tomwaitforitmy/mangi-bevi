import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Hyperlink from "react-native-hyperlink";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Colors from "../constants/Colors";
import HighlightedText from "./HighlightedText";
import { PreTestSplit } from "../common_functions/SplitTextToHighlight";
import IconTypes from "../constants/IconTypes";

const MyListItem = (props) => {
  const testIconId = props.title + "-icon";
  const searchTerm = props.searchTerm;

  const highlightText = PreTestSplit(props.title, searchTerm);

  const renderIcon = () => {
    if (!props.IconName) {
      return null;
    }

    const iconProps = {
      name: props.IconName,
      size: 24,
      color: Colors.primary,
      onPress: props.onPressIcon,
      testID: testIconId,
    };

    // Determine which icon library to use based on iconType
    if (props.iconType === IconTypes.ionicon) {
      return <Ionicons {...iconProps} color={"black"} />;
    }
    // "edit" is from MaterialIcons
    if (props.IconName === "edit") {
      return <MaterialIcons {...iconProps} color={"black"} />;
    }
    return <MaterialCommunityIcons {...iconProps} color={"black"} />;
  };

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
        {renderIcon()}
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
