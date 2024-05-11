import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GetAuthorName } from "../common_functions/GetAuthorName";
import { CountCooks } from "../common_functions/CountCooks";

const CookedByUserList = (props) => {
  const { cookedByUser, users } = props;
  const cooks = CountCooks(cookedByUser);

  const generateListContent = () => {
    let content = [];
    cooks.forEach((cook) => {
      const authorName = GetAuthorName(cook.userId, users);

      if (cook.amount === 1) {
        content.push(
          <Text style={styles.text} key={cook.userId}>
            {authorName + " cooked this"}
          </Text>,
        );
      } else {
        content.push(
          <Text style={styles.text} key={cook.userId}>
            {authorName + " cooked this " + cook.amount + " times"}
          </Text>,
        );
      }
    });

    return content;
  };

  return (
    <View style={{ ...styles.container, ...props.style }}>
      {generateListContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
  text: {
    borderRadius: 11,
    padding: 5,
    overflow: "hidden",
    margin: 1,
    fontSize: 15,
  },
});

export default CookedByUserList;
