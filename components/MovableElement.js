import React from "react";
import Element, { ELEMENT_HEIGHT } from "./Element";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

function MovableElement({ title, positions, id }) {
  const isGestureActive = useSharedValue(false);

  const top = useSharedValue(positions.value[id] * ELEMENT_HEIGHT);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = withSpring(isGestureActive.value ? 1.1 : 1);
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "90%",
      height: ELEMENT_HEIGHT,
      zIndex,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale },
      ],
    };
  });

  const pan = Gesture.Pan().onChange(
    ({ translationX, translationY }, context) => {
      isGestureActive.value = true;
      // translateX.value = translationX;
      translateY.value = translationY;
    }
  );

  pan.onEnd(() => {
    isGestureActive.value = false;
  });

  return (
    <Animated.View style={animatedStyle}>
      <GestureDetector gesture={pan}>
        <Animated.View style={{ width: "80%" }}>
          <Element title={title} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export default MovableElement;
