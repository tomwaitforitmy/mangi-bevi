import { Easing } from "react-native-reanimated";

export const ELEMENT_HEIGHT = 60;

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 150,
};

export function objectMove(object, from, to) {
  "worklet";
  const newObject = Object.assign({}, object);

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    }

    if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}

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
