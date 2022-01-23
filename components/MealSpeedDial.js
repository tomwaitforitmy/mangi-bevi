import React, { useState } from "react";
import { StyleSheet, View, Share } from "react-native";
import Colors from "../constants/Colors";
import { SpeedDial } from "react-native-elements";
import { GetMealSummary } from "../common_functions/GetMealSummary";

const MealSpeedDial = (props) => {
  const [open, setOpen] = useState(false);

  const shareMeal = async () => {
    try {
      const result = await Share.share({
        message: GetMealSummary(props.title, props.ingredients, props.steps),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setOpen(false);
    }
  };

  return (
    // <View style={{ ...styles.container, ...props.style }}>
    <SpeedDial
      color={Colors.primary}
      isOpen={open}
      icon={{ name: "add", color: "#fff" }}
      openIcon={{ name: "close", color: "#fff" }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
    >
      <SpeedDial.Action
        icon={{ name: "tag", color: "#fff" }}
        title="Tag"
        color={Colors.primary}
        onPress={() => console.log("Add Something")}
      />
      <SpeedDial.Action
        icon={{ name: "share", color: "#fff" }}
        title="Share"
        color={Colors.primary}
        onPress={shareMeal}
      />
      <SpeedDial.Action
        icon={{ name: "star", color: "#fff" }}
        title="Rate"
        color={Colors.primary}
        onPress={() => console.log("Delete Something")}
      />
    </SpeedDial>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default MealSpeedDial;
