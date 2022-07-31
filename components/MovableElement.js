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
  sortedIndex,
  swapElementWithHigherOrder,
  swapElementWithLowerOrder,
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
      "worklet";
      if (currentPosition !== previousPosition) {
        //only if there is change in position
        if (!isGestureActive.value) {
          //only if this element is not getting touched
          //update the translation with a nice animation
          translateY.value = currentPosition; // withSpring(currentPosition, animationConfig);
          //offset is not used for animations, but we need it as start point for new gestures
          offsetY.value = currentPosition;
        }
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const zIndex = isGestureActive.value ? 1 : 0;
    const scale = 1; // withSpring(isGestureActive.value ? 1.05 : 1, animationConfig);
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      borderColor: "white",
      height: positions.value[index].height,
      zIndex,
      transform: [{ translateY: translateY.value }, { scale }],
    };
  });

  const pan = Gesture.Pan().onChange(
    ({ translationX, translationY, absoluteY, velocityY }) => {
      "worklet";
      //Schützt nicht vor crash ???
      // if (Math.abs(velocityY) > 1000) {
      //   console.log("velocityY", velocityY);
      //   return;
      // }
      //translate by the correct value:
      //translationY is relative, accumulated over the whole gesture
      //offsetY.value is the starting point, determined by the size of the whole thing
      translateY.value = offsetY.value + translationY;

      //get the position Id based on movement
      const newOrderCandidate = sortedIndex(
        positions.value.map((e) => e.threshold),
        translateY.value
      );

      //Scheint nicht nötig?
      // //remove values out of range
      // const newOrderCandidate = clamp(
      //   newPositionId,
      //   0,
      //   Object.keys(positions.value).length - 1
      // );

      // Swap the positions if needed
      if (newOrderCandidate > positions.value[index].order) {
        const to = positions.value.findIndex(
          (e) => e.order === newOrderCandidate
        );

        positions.value = swapElementWithHigherOrder(
          positions.value,
          index,
          to
        );
      } else if (newOrderCandidate < positions.value[index].order) {
        const to = positions.value.findIndex(
          (e) => e.order === newOrderCandidate
        );

        positions.value = swapElementWithLowerOrder(positions.value, index, to);
      }
    }
  );

  pan.onStart((event) => {
    "worklet";
    isGestureActive.value = true;
  });

  pan.onEnd((event) => {
    "worklet";
    //Animated to the final position
    const posY = positions.value[index].position;
    translateY.value = posY; //withSpring(posY, animationConfig);
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
