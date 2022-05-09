import React from "react";
import Element from "./Element";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  clamp,
  CreateFake,
  getPositionId,
  getPositionY,
  getTotalSize,
  moveElement,
  sortedIndex,
  swapElement,
} from "./MovableElementContainerUtil";
import { animationConfig } from "./MovableElementContainerConfig";

function MovableElement({ index, positions }) {
  const isGestureActive = useSharedValue(false);

  const pos = positions.value[index].position;
  //starting point for incoming gestures
  const offsetY = useSharedValue(pos);
  //translation applied to the element while moving
  const translateY = useSharedValue(pos);

  //this reaction changes the position of elements, that are not touched
  useAnimatedReaction(
    () => positions.value[index].position, //listen to value[id] for changes made by gesture
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        //only if there is change in position
        if (!isGestureActive.value) {
          //only if this element is not getting touched
          //update the translation with a nice animation
          translateY.value = withSpring(currentPosition, animationConfig);
          //offset is not used for animations, but we need it as start point for new gestures
          offsetY.value = currentPosition;
        }
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 1 : 0;
    const scale = withSpring(isGestureActive.value ? 1.05 : 1, animationConfig);
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: positions.value[index].height,
      zIndex,
      transform: [{ translateY: translateY.value }, { scale }],
    };
  });

  const pan = Gesture.Pan().onChange(
    ({ translationX, translationY, absoluteY }) => {
      //translate by the correct value:
      //translationY is relative, accumulated over the whole gesture
      //offsetY.value is the starting point, determined by the size of the whole thing
      translateY.value = offsetY.value + translationY;

      //get the position Id based on movement
      const newPositionId = sortedIndex(
        positions.value.map((e) => e.threshold),
        translateY.value
      );

      //remove values out of range
      const newOrderCandidate = clamp(
        newPositionId,
        0,
        Object.keys(positions.value).length - 1
      );

      console.log("newOrderCandidate", newOrderCandidate);

      // Swap the positions if needed
      if (newOrderCandidate !== positions.value[index].order) {
        console.log("swap");
        const to = positions.value.findIndex(
          (e) => e.order === newOrderCandidate
        );
        // console.log("to index", to);

        positions.value = swapElement(positions.value, index, to);
      }
    }
  );

  pan.onStart((event) => {
    isGestureActive.value = true;
  });

  pan.onEnd((event) => {
    //Animated to the final position
    const posY = positions.value[index].position;
    translateY.value = withSpring(posY, animationConfig);
    //update the offset for new gestures
    offsetY.value = posY;
    isGestureActive.value = false;
  });

  return (
    <Animated.View style={animatedStyle}>
      <GestureDetector gesture={pan}>
        <Animated.View style={{ width: "90%" }}>
          <Element title={positions.value[index].title} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export default MovableElement;
