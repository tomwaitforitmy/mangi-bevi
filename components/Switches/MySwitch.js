import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useAppTheme } from "../../theme/useAppTheme";

const MySwitch = ({
  descriptionText,
  trueText,
  falseText,
  style,
  onValueChange,
  value,
  modeOnOff,
  testID,
}) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const trueFalseText =
    value === true ? (
      <Text style={styles.trueFalseText}>{trueText}</Text>
    ) : (
      <Text style={styles.trueFalseText}>{falseText}</Text>
    );
  const falseColor = modeOnOff ? theme.colors.gray : theme.colors.primary;

  return (
    <View style={{ ...styles.container, ...style }}>
      <Text style={styles.descriptionText}>
        {descriptionText}
        {trueFalseText}
      </Text>
      <Switch
        testID={testID}
        trackColor={{
          false: falseColor,
          true: theme.colors.second,
        }} //track is part in the background
        thumbColor={theme.colors.white} //thumb is the toggle in the front
        ios_backgroundColor={falseColor}
        onValueChange={(v) => onValueChange(v)}
        value={value}
      />
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    descriptionText: {
      fontSize: 16,
      textAlign: "left",
      color: theme.colors.onSurfaceVariant,
    },
    trueFalseText: {
      fontWeight: "bold",
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 5,
      width: "100%",
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.screenBackGround,
      borderWidth: 1,
    },
  });

export default MySwitch;
