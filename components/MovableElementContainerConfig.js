import { Easing } from "react-native-reanimated";

export const ELEMENT_HEIGHT = 60;

export const ELEMENTS = [
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

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 150,
};

export const listToPositions = (list) => {
  const values = Object.values(list);
  const positions = {};

  for (let i = 0; i < values.length; i++) {
    positions[values[i].id] = i;
  }

  return positions;
};

export const moveElement = (element, from, to) => {
  "worklet";
  const newObject = Object.assign({}, element);

  for (const id in element) {
    if (element[id] === from) {
      newObject[id] = to;
    }

    if (element[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
};

export const clamp = (value, lowerBound, upperBound) => {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
};

export const getPositionId = (absoluteY) => {
  "worklet";
  const positionId = Math.round(absoluteY / ELEMENT_HEIGHT);
  return positionId;
};

export const getPositionY = (position) => {
  "worklet";
  const y = position * ELEMENT_HEIGHT;
  return y;
};
