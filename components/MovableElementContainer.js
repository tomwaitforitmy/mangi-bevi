import React from "react";
import { View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { ELEMENT_HEIGHT } from "./Element";
import MovableElement from "./MovableElement";

const ELEMENTS = [
  {
    id: "0",
    title: "Tomaten, frisch und gewaschen",
  },
  {
    id: "1",
    title: "Zwiebeln, gehackt",
  },
  {
    id: "2",
    title: "Knoblauch, zerdrückt",
  },
  {
    id: "3",
    title: "Karotten, geschält und gehackt",
  },
  {
    id: "4",
    title: "Paprika, in Stücken",
  },
  {
    id: "5",
    title: "Salz und Pfeffer",
  },
  {
    id: "6",
    title: "1 Zitrone",
  },
  {
    id: "7",
    title: "3 Zitronen",
  },
  {
    id: "8",
    title: "8 Zitronen",
  },
  {
    id: "9",
    title: "2 Zitronen",
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

  console.log(myObjs);

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
