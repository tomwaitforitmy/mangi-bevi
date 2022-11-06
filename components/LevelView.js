import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { GetLevelPercent } from "../common_functions/GetLevelPercent";
import { GetNextReward, GetReward } from "../common_functions/GetReward";
import IconTypes from "../constants/IconTypes";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Level from "../models/Level";
import Colors from "../constants/Colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

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

  const sharedValue = useSharedValue(0);

  sharedValue.value = withDelay(500, withTiming(percent, { duration: 1000 }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: (sharedValue.value * 100).toFixed(2) + "%",
    };
  });

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
          backgroundColor: "white",
          width: "20%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}>
        {/* <FontAwesome5 name="carrot" size={60} color="orange" /> */}
        <MaterialCommunityIcons name="chef-hat" size={60} color="black" />
        {/* <Icon
          name="pricetags"
          color={Colors.primary}
          type={IconTypes.ionicon}
          size={60}
        /> */}
      </View>
      <View
        style={{
          backgroundColor: "white",
          width: "80%",
          height: "100%",
          flexDirection: "column",
        }}>
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "40%",
            justifyContent: "center",
          }}>
          <Text style={{ fontSize: 18 }}>{level.currentTitle}</Text>
        </View>
        <Animated.View style={[styles.levelBar, animatedStyle]}>
          <Text
            style={{
              color: "white",
            }}>
            {value}
          </Text>
        </Animated.View>
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "20%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingLeft: 2,
            paddingRight: 2,
          }}>
          <Text>{level.lowerThreshold}</Text>
          <Text>{level.upperThreshold}</Text>
        </View>
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "15%",
          }}>
          <Text style={{ color: Colors.second, fontSize: 10 }}>
            Next: {level.nextTitle}
          </Text>
        </View>
      </View>
      {/* <Text>Current title {level.currentTitle}</Text>
      <Text>Next title {level.nextTitle}</Text>
      <Text>Current min {level.lowerThreshold}</Text>
      <Text>Current value {level.value}</Text>
      <Text>Next title at value {level.upperThreshold}</Text>
      <Text>Percent {level.percent} of 1</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "grey",
    borderWidth: StyleSheet.hairlineWidth,
    margin: 4,
    backgroundColor: "white",
    padding: 4,
    flexDirection: "row",
    height: 100,
  },
  levelBar: {
    backgroundColor: Colors.primary,
    // width: "100%",
    height: "25%",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LevelView;
