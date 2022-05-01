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
  ELEMENT_HEIGHT,
  getNewPosition,
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
          translateY.value = withSpring(
            getPositionY(currentPosition),
            animationConfig
          );
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

      const translatePositions = getPositionTranslationY(translationY);

      const newPosition = getNewPosition(
        positions.value[id],
        translatePositions,
        Object.keys(positions.value).length - 1
      );

      // console.log("newPosition");
      // console.log(newPosition);

      // 2. We swap the positions
      if (newPosition !== positions.value[id]) {
        positions.value = objectMove(
          positions.value,
          positions.value[id],
          newPosition
        );
      }
    }
  );

  pan.onStart((event) => {
    const offset = getPositionY(positions.value[id]);
    console.log(offset);
    translateY.value = offset;
    isGestureActive.value = true;
  });

  pan.onEnd(({ translationX, translationY, absoluteY }) => {
    const posY = getPositionY(positions.value[id]);

    offetsetY.value = withSpring(posY);
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
