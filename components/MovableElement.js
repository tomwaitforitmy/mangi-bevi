import React from "react";
import Element from "./Element";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  animationConfig,
  ELEMENT_HEIGHT,
  getNewPosition,
  getPositionTranslationY,
  getPositionY,
} from "./MovableElementContainerConfig";

function MovableElement({ title, positions, id, numberOfElements }) {
  const isGestureActive = useSharedValue(false);

  console.log(numberOfElements);

  const offetsetY = useSharedValue(getPositionY(positions.value[id]));

  const translateY = useSharedValue(getPositionY(positions.value[id]));

  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = withSpring(isGestureActive.value ? 1.1 : 1);
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: ELEMENT_HEIGHT,
      zIndex,
      transform: [
        { translateX: 0 },
        { translateY: translateY.value },
        { scale },
      ],
    };
  });

  const pan = Gesture.Pan().onChange(
    ({ translationX, translationY, absoluteY }) => {
      translateY.value = offetsetY.value + translationY;
    }
  );

  pan.onStart((event) => {
    const offset = getPositionY(positions.value[id]);
    console.log(offset);
    translateY.value = offset;
    isGestureActive.value = true;
  });

  pan.onEnd(({ translationX, translationY, absoluteY }) => {
    const translatePositions = getPositionTranslationY(translationY);
    console.log("prev pos");
    console.log(positions.value[id]);

    const newPosition = getNewPosition(
      positions.value[id],
      translatePositions,
      numberOfElements //todo: not working to pass value here!?
    );

    console.log("new pos");
    console.log(newPosition);
    console.log("new posY");
    const posY = getPositionY(newPosition);
    console.log(posY);

    offetsetY.value = withSpring(posY);
    translateY.value = withSpring(posY);

    // positions.value[id].value = newPosition;

    isGestureActive.value = false;
  });

  return (
    <Animated.View style={animatedStyle}>
      <GestureDetector gesture={pan}>
        <Animated.View style={{ width: "100%" }}>
          <Element title={title} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export default MovableElement;
