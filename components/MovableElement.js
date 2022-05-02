import React from "react";
import Element from "./Element";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
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
  getPositionId,
  getPositionY,
  objectMove,
} from "./MovableElementContainerConfig";

function MovableElement({ title, positions, id }) {
  const isGestureActive = useSharedValue(false);
  //starting point for incoming gestures
  const offsetY = useSharedValue(getPositionY(positions.value[id]));
  //translation applied to the element while moving
  const translateY = useSharedValue(getPositionY(positions.value[id]));

  //this reaction changes the position of elements, that are not touched
  useAnimatedReaction(
    () => positions.value[id], //listen to value[id] for changes made by gesture
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        //only if there is change in position
        if (!isGestureActive.value) {
          //only if this element is not getting touched
          //update the translation with a nice animation
          translateY.value = withSpring(getPositionY(currentPosition));
          //offset is not used for animations, but we need it as start point for new gestures
          offsetY.value = getPositionY(currentPosition);
        }
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 1 : 0;
    const scale = withSpring(isGestureActive.value ? 1.05 : 1);
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
      //translate by the correct value:
      //translationY is relative, accumulated over the whole gesture
      //offsetY.value is the starting point, determined by the size of the whole thing
      translateY.value = offsetY.value + translationY;

      //get the position Id based on movement
      const newPositionId = getPositionId(translateY.value);

      //remove values out of range
      const newPositionCandidate = clamp(
        newPositionId,
        0,
        Object.keys(positions.value).length - 1
      );

      // Swap the positions if needed
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

  pan.onEnd((event) => {
    //Animated to the final position
    const posY = getPositionY(positions.value[id]);
    translateY.value = withSpring(posY);
    //update the offset for new gestures
    offsetY.value = posY;

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
