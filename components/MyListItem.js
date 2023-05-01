import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import Hyperlink from "react-native-hyperlink";
import Colors from "../constants/Colors";

const MyListItem = (props) => {
  const testIconId = props.title + "-icon";
  const searchTerm = props.searchTerm;
  const renderColor = searchTerm !== undefined;

  return (
    <View style={styles.listItemView}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <Hyperlink linkDefault={true} linkStyle={styles.linkStyle}>
            <ListItem.Title>
              {renderColor
                ? props.title.split(searchTerm).map((x, index) => (
                    <Text key={index} style={styles.regularText}>
                      {index !== 0 && (
                        <Text style={styles.markedText}>{searchTerm}</Text>
                      )}
                      {x}
                    </Text>
                  ))
                : props.title}
            </ListItem.Title>
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
  markedText: { color: Colors.searchTermHighlight },
  linkStyle: { color: Colors.hyperlink },
  listItemView: {
    marginHorizontal: 10,
    padding: 2,
  },
});

export default MyListItem;
