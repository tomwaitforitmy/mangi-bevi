import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import Colors from "../../constants/Colors";

const MySwitch = ({
  descriptionText,
  trueText,
  falseText,
  style,
  onValueChange,
  value,
  modeOnOff,
}) => {
  const trueFalseText =
    value === true ? (
      <Text style={styles.trueFalseText}>{trueText}</Text>
    ) : (
      <Text style={styles.trueFalseText}>{falseText}</Text>
    );
  const falseColor = modeOnOff ? "grey" : Colors.primary;

  return (
    <View style={{ ...styles.container, ...style }}>
      <Text style={styles.descriptionText}>
        {descriptionText}
        {trueFalseText}
      </Text>
      <Switch
        trackColor={{
          false: falseColor,
          true: Colors.second,
        }} //track is part in the background
        thumbColor={Colors.white} //thumb is the toggle in the front
        ios_backgroundColor={falseColor}
        onValueChange={(v) => onValueChange(v)}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionText: {
    fontSize: 14,
    textAlign: "left",
    color: "grey",
  },
  trueFalseText: {
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    width: "100%",
  },
});

export default MySwitch;
