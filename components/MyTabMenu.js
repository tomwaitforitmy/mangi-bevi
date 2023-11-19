import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Colors from "../constants/Colors";

const MyTabMenu = ({ titles, windowWidth, onTabPress }) => {
  const paddingLeftRight = 5;
  const numberOfTabs = titles.length;
  //we remove 2 times the site padding and we have 2 pixel less (one for each side of grey background)
  const tabWith = (windowWidth - 2 - paddingLeftRight * 2) / numberOfTabs;

  const position = useSharedValue(1);

  const selectedButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: position.value,
      right: 1,
      top: 1,
      width: tabWith,
    };
  });

  const handlePress = (index, text) => {
    position.value = withSpring(1 + tabWith * index);
    onTabPress(text);
  };

  return (
    <View
      style={{
        ...styles.container,
        ...{ paddingLeft: paddingLeftRight, paddingRight: paddingLeftRight },
      }}>
      <View style={styles.buttonGroup}>
        <Animated.View
          style={[styles.selectedButton, selectedButtonAnimatedStyle]}
        />
        {titles.map((text, index) => (
          <Pressable
            key={index}
            style={{ ...styles.menuButton, ...{ width: tabWith } }}
            onPress={() => handlePress(index, text)}>
            <Text style={styles.text}>{text}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
  },
  menuButton: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: Colors.screenBackGround,
    height: "100%",
    borderRadius: 5,
  },
  buttonGroup: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    maxHeight: 35,
    backgroundColor: Colors.myTabMenuBackground,
    borderRadius: 5,
    paddingBottom: 2,
    marginBottom: 5,
  },
  container: {
    paddingTop: 5,
    minHeight: 35,
    alignItems: "center",
    width: "100%",
  },
});

export default MyTabMenu;
