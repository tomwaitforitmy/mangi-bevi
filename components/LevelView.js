import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GetLevelPercent } from "../common_functions/GetLevelPercent";
import { GetNextReward, GetReward } from "../common_functions/GetReward";
import Level from "../models/Level";

const LevelView = (props) => {
  const rewards = props.rewards;
  const value = props.value;
  const nextReward = GetNextReward(value, rewards);
  const reward = GetReward(value, rewards);
  const percent = GetLevelPercent(
    reward.threshold,
    nextReward.threshold,
    value,
  );

  const level = new Level(
    reward.threshold,
    nextReward.threshold,
    value,
    reward.title,
    nextReward.title,
    percent,
  );

  return (
    <View style={{ ...styles.container, ...props.style }}>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Text>Current title {level.currentTitle}</Text>
      <Text>Next title {level.nextTitle}</Text>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Text>Current min {level.lowerThreshold}</Text>
      <Text>Current value {level.value}</Text>
      <Text>Next title at value {level.upperThreshold}</Text>
      <Text>Percent {level.percent} of 1</Text>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default LevelView;
