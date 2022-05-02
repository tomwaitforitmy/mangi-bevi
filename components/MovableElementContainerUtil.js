import { ELEMENT_HEIGHT } from "./MovableElementContainerConfig";

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
