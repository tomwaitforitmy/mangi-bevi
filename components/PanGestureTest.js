import React, { useRef } from "react";
import {
  Animated,
  Image,
  PanResponder,
  useWindowDimensions,
} from "react-native";

const IMAGE_URI =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg/800px-Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg";

const pointsDistance = ([xA, yA], [xB, yB]) => {
  return Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2));
};

const PanGestureTest = (props) => {
  const dimensions = useWindowDimensions();

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // More accurate than gestureState.numberActiveTouches
        // https://github.com/facebook/react-native/blob/8a31dfe567a22dbc018ea763b0a9706068276c4a/Libraries/Interaction/PanResponder.js#L383-L384
        const activeTouches = event.nativeEvent.changedTouches.length;

        if (activeTouches === 1) {
          pan.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        } else if (activeTouches >= 2) {
          const touches = event.nativeEvent.changedTouches;

          const touchA = touches[0];
          const touchB = touches[1];

          const distance = pointsDistance(
            [touchA.pageX, touchA.pageY],
            [touchB.pageX, touchB.pageY]
          );

          const screenMovedPercents = distance / dimensions.width;

          scale.setValue(1 + screenMovedPercents);
        }
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(pan, {
            toValue: {
              x: 0,
              y: 0,
            },
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  return (
    <Animated.Image
      {...panResponder.panHandlers}
      source={{ uri: IMAGE_URI }}
      style={{
        height: 300,
        width: "100%",
        borderRadius: 10,
        transform: [
          // or pan.getTranslateTransform()
          { translateX: pan.x },
          { translateY: pan.y },
          { scale },
        ],
      }}
    />
  );
};

export default PanGestureTest;
