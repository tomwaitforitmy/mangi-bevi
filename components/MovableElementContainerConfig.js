import { Easing } from "react-native-reanimated";

// export const ELEMENT_HEIGHT = 60;

export const ELEMENTS = [
  {
    id: "0",
    title: "Frische Tomaten",
    size: 60,
  },
  {
    id: "1",
    title: "1 Zitrone",
    size: 60,
  },
  {
    id: "2",
    title: "Tomatenmark",
    size: 60,
  },
  {
    id: "3",
    title: "Knoblauch",
    size: 60,
  },
  {
    id: "4",
    title: "Salz und Pfeffer",
    size: 60,
  },
  {
    id: "5",
    title: "Spaghetti",
    size: 60,
  },
  {
    id: "6",
    title: "Käse 😊",
    size: 60,
  },
  {
    id: "7",
    title:
      "Tomaten mit viel Basilikum, ... Tomaten mit extra Basilikum \
      Tomaten mit viel Basilikum, Tomaten mit viel Basilikum \
      Tomaten mit viel Basilikum, ... Tomaten mit extra Basilikum \
      Tomaten mit viel Basilikum, Tomaten mit viel Basilikum",
    size: 190,
  },
  {
    id: "8",
    title: "8 Zitronen",
    size: 60,
  },
  {
    id: "9",
    title: "9 Zitronen",
    size: 60,
  },
  {
    id: "10",
    title: "Mehr Zitronen",
    size: 60,
  },
  {
    id: "11",
    title: "Noch mehr Zitronen",
    size: 60,
  },
  {
    id: "12",
    title: ":) Zitronen",
    size: 60,
  },
];

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 150,
};
