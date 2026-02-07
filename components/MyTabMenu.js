import React, {
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useImperativeHandle,
  useRef,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Colors from "../constants/Colors";

const MyTabMenu = memo(
  forwardRef(
    (
      { titles, windowWidth, onTabPress, initialIndex, updateRenderCounter },
      ref,
    ) => {
      const paddingLeftRight = 5;
      const numberOfTabs = titles.length;
      //we remove 2 times the site padding and we have 2 pixel less (one for each side of grey background)
      //memo saves this computation
      const tabWith = useMemo(() => {
        return (windowWidth - 2 - paddingLeftRight * 2) / numberOfTabs;
      }, [windowWidth, paddingLeftRight, numberOfTabs]);
      let initialPosition = 1 + tabWith * initialIndex;
      const position = useSharedValue(initialPosition);
      const lastUserPressedIndexRef = useRef(initialIndex);

      useEffect(() => {
        // Only animate if this is an external change (not from handlePress)
        if (initialIndex !== lastUserPressedIndexRef.current) {
          position.value = withSpring(1 + tabWith * initialIndex);
        }
        // After syncing, update the ref for next comparison
        lastUserPressedIndexRef.current = initialIndex;
      }, [initialIndex, tabWith]);

      useEffect(() => {
        console.log("🚨 MyTabMenu re-rendered");
      });

      //this is for the swipe gesture triggered from NewScreen
      useImperativeHandle(ref, () => ({
        swipe: (index, text) => {
          handlePress(index, text);
        },
      }));

      const selectedButtonAnimatedStyle = useAnimatedStyle(() => {
        // console.log("🔄 Animation Triggered in MyTabMenu");
        return {
          position: "absolute",
          left: position.value,
          right: 1,
          top: 1,
          width: tabWith,
        };
      });

      const handlePress = (index, text) => {
        lastUserPressedIndexRef.current = index; // Track user press
        position.value = withSpring(1 + tabWith * index);
        onTabPress(text);
        console.log(`📍 MyTabMenu - Tab Pressed: ${text}, Index: ${index}`);
      };

      // Animation is handled in handlePress only
      // Redux initialIndex just syncs the visual state across re-renders
      // without re-triggering animation

      return (
        <View
          style={{
            ...styles.container,
            ...{
              paddingLeft: paddingLeftRight,
              paddingRight: paddingLeftRight,
            },
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
    },
  ),
);

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
