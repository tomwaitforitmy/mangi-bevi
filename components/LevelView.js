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

  //simulator to understand these params:
  // https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring
  sharedValue.value = withDelay(
    500,
    withSpring(percent, {
      mass: 1.5,
      damping: 15,
      stiffness: 150,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
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
      <View style={styles.iconContainer}>
        <Text style={styles.rewardCategoryText}>{props.rewardCategory}</Text>
        {props.icon()}
        <Text style={styles.rewardCategoryText}>Level {reward.id}</Text>
      </View>
      <View style={styles.rightSideSuperContainer}>
        <View style={styles.currentTitleContainer}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            style={styles.currentTitleText}>
            {level.currentTitle}
          </Text>
        </View>
        <View style={styles.levelBarContainer}>
          <Animated.View style={[styles.levelBar, growWidthAnimatedStyle]} />
        </View>
        <View style={styles.nextTitleContainer}>
          <Text numberOfLines={1} style={styles.nextTitleText}>
            Next: {level.nextTitle}
          </Text>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.valueOfLevelText}>
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
    width: "70%",
    height: "100%",
    flexDirection: "column",
  },
  iconContainer: {
    backgroundColor: Colors.levelViewBackground,
    width: "30%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardCategoryText: {
    fontSize: 12,
    color: Colors.levelViewTexts,
  },
  levelBarContainer: {
    backgroundColor: Colors.levelViewBarBackground,
    height: "25%",
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
    height: "50%",
    justifyContent: "center",
  },
  currentTitleText: {
    color: Colors.levelViewTexts,
    fontSize: 18,
  },
  nextTitleContainer: {
    backgroundColor: Colors.levelViewBackground,
    width: "100%",
    height: "25%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextTitleText: {
    color: Colors.levelViewTexts,
    fontSize: 12,
    width: "80%",
  },
  //value of / to upperThreshold text
  valueOfLevelText: {
    color: Colors.levelViewTexts,
    fontSize: 12,
    width: "20%",
    textAlign: "right",
  },
});

export default LevelView;
