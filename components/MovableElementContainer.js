import React from "react";
import { View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import MovableElement from "./MovableElement";
import { ELEMENTS } from "./MovableElementContainerConfig";
import {
  CreateMovableDataArray,
  getTotalSize,
} from "./MovableElementContainerUtil";

export default function MovableElementContainer() {
  const dataArray = CreateMovableDataArray(ELEMENTS);
  const positions = useSharedValue(dataArray);
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
        // scrollEventThrottle={16}
      >
        {positions.value.map((e, i) => (
          <MovableElement key={i} index={i} positions={positions} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
