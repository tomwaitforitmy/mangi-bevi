import React from "react";
import { View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import MovableElement from "./MovableElement";
import {
  ELEMENTS,
  ELEMENT_HEIGHT,
  listToPositions,
} from "./MovableElementContainerConfig";

export default function MovableElementContainer() {
  const positionObject = listToPositions(ELEMENTS);
  const positions = useSharedValue(positionObject);

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        style={{
          flex: 1,
          position: "relative",
        }}
        contentContainerStyle={{
          height: ELEMENTS.length * ELEMENT_HEIGHT,
          width: "100%",
        }}
      >
        {ELEMENTS.map((e, i) => (
          <MovableElement
            key={i}
            id={i}
            title={e.title}
            positions={positions}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
