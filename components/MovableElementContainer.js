import React from "react";
import { View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import MovableElement from "./MovableElement";
import { ELEMENT_HEIGHT } from "./MovableElementContainerConfig";

const ELEMENTS = [
  {
    id: "0",
    title: "Frische Tomaten",
  },
  {
    id: "1",
    title: "1 Zitrone",
  },
  {
    id: "2",
    title: "Tomatenmark",
  },
  {
    id: "3",
    title: "Knoblauch",
  },
  {
    id: "4",
    title: "Salz und Pfeffer",
  },
  {
    id: "5",
    title: "Spaghetti",
  },
  {
    id: "6",
    title: "Käse 😊",
  },
  {
    id: "7",
    title:
      "Tomaten mit viel Basilikum, ... Tomaten mit viel Basilikum \
      Tomaten mit viel Basilikum, Tomaten mit viel Basilikum",
  },
  {
    id: "8",
    title: "8 Zitronen",
  },
  {
    id: "9",
    title: "9 Zitronen",
  },
  {
    id: "10",
    title: "Mehr Zitronen",
  },
  {
    id: "11",
    title: "Noch mehr Zitronen",
  },
  {
    id: "12",
    title: ":) Zitronen",
  },
];

function listToObject(list) {
  const values = Object.values(list);
  const object = {};

  for (let i = 0; i < values.length; i++) {
    object[values[i].id] = i;
  }

  return object;
}

export default function MovableElementContainer() {
  const myObjs = listToObject(ELEMENTS);
  const positions = useSharedValue(myObjs);

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
