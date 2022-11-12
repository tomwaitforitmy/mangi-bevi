import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GetLevelPercent } from "../common_functions/GetLevelPercent";
import { GetNextReward, GetReward } from "../common_functions/GetReward";

import Level from "../models/Level";
import Colors from "../constants/Colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
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

  sharedValue.value = withDelay(
    500,
    withSpring(percent, {
      duration: 1000,
      stiffness: 150,
    }),
  );

  const growWidthAnimatedStyle = useAnimatedStyle(() => {
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
      <View style={styles.iconContainer}>{props.icon()}</View>
      <View style={styles.rightSideSuperContainer}>
        <View style={styles.currentTitleContainer}>
          <Text style={styles.currentTitleText}>{level.currentTitle}</Text>
        </View>
        <View style={styles.levelBarContainer}>
          <Animated.View style={[styles.levelBar, growWidthAnimatedStyle]} />
        </View>
        <View style={styles.nextTitleContainer}>
          <Text style={styles.nextTitleText}>Next: {level.nextTitle}</Text>
          <Text style={styles.valueOfLevelText}>
            {value + "/" + level.upperThreshold}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //contains icon and rightSideSuperContainer
  container: {
    borderColor: "grey",
    borderWidth: StyleSheet.hairlineWidth,
    margin: 4,
    backgroundColor: Colors.levelViewBackground,
    padding: 4,
    flexDirection: "row",
    height: 100,
  },
  //contains all elements on the right (everything except the icon)
  rightSideSuperContainer: {
    backgroundColor: Colors.levelViewBackground,
    width: "80%",
    height: "100%",
    flexDirection: "column",
  },
  iconContainer: {
    backgroundColor: Colors.levelViewBackground,
    width: "20%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  levelBarContainer: {
    backgroundColor: Colors.levelViewBarBackground,
    height: "30%",
    borderColor: Colors.levelViewBarBackgroundBorder,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    overflow: "hidden",
  },
  levelBar: {
    backgroundColor: Colors.levelViewBar,
    height: "100%",
  },
  currentTitleContainer: {
    backgroundColor: Colors.levelViewBackground,
    width: "100%",
    height: "40%",
    justifyContent: "center",
  },
  currentTitleText: { color: Colors.levelViewTexts, fontSize: 18 },
  nextTitleContainer: {
    backgroundColor: Colors.levelViewBackground,
    width: "100%",
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextTitleText: { color: Colors.levelViewTexts, fontSize: 12 },
  //value of / to upperThreshold text
  valueOfLevelText: { color: Colors.levelViewTexts, fontSize: 12 },
});

export default LevelView;
