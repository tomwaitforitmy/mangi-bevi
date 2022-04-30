import React from "react";
import { View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
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
];

const ELEMENT_HEIGHT = 100;

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
      {ELEMENTS.map((e, i) => (
        <MovableElement key={i} id={i} title={e.title} positions={positions} />
      ))}
    </View>

    // <View style={{ flex: 1 }}>
    //   <Animated.ScrollView
    //     style={{
    //       flex: 1,
    //       position: "relative",
    //       backgroundColor: "white",
    //     }}
    //     contentContainerStyle={{
    //       height: ELEMENTS.length * (ELEMENT_HEIGHT + 2),
    //     }}
    //   >
    //     {ELEMENTS.map((e) => (
    //       <PressableElement
    //         key={e.id}
    //         id={e.id}
    //         title={e.title}
    //         positions={positions}
    //       />
    //     ))}
    //   </Animated.ScrollView>
    // </View>
  );
}
