import React from "react";
import Element from "./Element";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  animationConfig,
  clamp,
  ELEMENT_HEIGHT,
  getNewPosition,
  getPositionId,
  getPositionTranslationY,
  getPositionY,
  objectMove,
} from "./MovableElementContainerConfig";

function MovableElement({ title, positions, id, numberOfElements }) {
  const isGestureActive = useSharedValue(false);
  const offetsetY = useSharedValue(getPositionY(positions.value[id]));
  const translateY = useSharedValue(getPositionY(positions.value[id]));

  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        if (!isGestureActive.value) {
          translateY.value = withSpring(getPositionY(currentPosition));
          offetsetY.value = getPositionY(currentPosition);
        }
      }
    }
  );

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

      const newPositionId = getPositionId(translateY.value);

      // console.log("positions.value[id]");
      // console.log(positions.value);

      const newPositionCandidate = clamp(
        newPositionId,
        0,
        Object.keys(positions.value).length - 1
      );

      console.log("newPositionCandidate");
      console.log(newPositionCandidate);

      // 2. We swap the positions
      if (newPositionCandidate !== positions.value[id]) {
        positions.value = objectMove(
          positions.value,
          positions.value[id],
          newPositionCandidate
        );
      }
    }
  );

  pan.onStart((event) => {
    isGestureActive.value = true;
  });

  pan.onEnd(({ translationX, translationY, absoluteY }) => {
    const posY = getPositionY(positions.value[id]);

    offetsetY.value = posY;
    translateY.value = withSpring(posY);

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
