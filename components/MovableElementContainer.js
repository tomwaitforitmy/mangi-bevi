import React from "react";
import { View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import MovableElement from "./MovableElement";
import { ELEMENTS } from "./MovableElementContainerConfig";
import { getTotalSize, listToPositions } from "./MovableElementContainerUtil";

export default function MovableElementContainer() {
  const positionObject = listToPositions(ELEMENTS);
  console.log("positionObject", positionObject);
  const positions = useSharedValue(positionObject);
  const totalSize = getTotalSize(ELEMENTS);

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: "red",
        }}
        contentContainerStyle={{
          height: totalSize,
          width: "100%",
        }}
      >
        {ELEMENTS.map((e, i) => (
          <MovableElement
            key={i}
            id={i}
            title={e.title}
            positions={positions}
            size={e.size}
            totalSize={totalSize}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
