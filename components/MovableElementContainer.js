import React from "react";
import { View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import MovableElement from "./MovableElement";
import { ELEMENT_HEIGHT } from "./MovableElementContainerConfig";

const ELEMENTS = [
  {
    id: "0",
    title: "0",
  },
  {
    id: "1",
    title: "1",
  },
  {
    id: "2",
    title: "2",
  },
  {
    id: "3",
    title: "3",
  },
  {
    id: "4",
    title: "4",
  },
  {
    id: "5",
    title: "5",
  },
  {
    id: "6",
    title: "6",
  },
  {
    id: "7",
    title: "7",
  },
  {
    id: "8",
    title: "8",
  },
  {
    id: "9",
    title: "9",
  },
  // {
  //   id: "10",
  //   title: "Mehr Zitronen",
  // },
  // {
  //   id: "11",
  //   title: "Noch mehr Zitronen",
  // },
  // {
  //   id: "12",
  //   title: ":) Zitronen",
  // },
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

  const maxPosition = ELEMENTS.length - 1;

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
            numberOfElements={maxPosition}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
