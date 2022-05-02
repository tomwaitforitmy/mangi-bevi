// import { Dimensions } from "react-native";
import { Easing } from "react-native-reanimated";

// const { width } = Dimensions.get("window");
// export const MARGIN = 8;
export const ELEMENT_HEIGHT = 60;
// export const ELEMENT_WIDTH = width - MARGIN;

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350,
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

export const getNewPosition = (
  oldPosition,
  positionTranslationY,
  maxPosition
) => {
  // "worklet";
  if (positionTranslationY > 0) {
    return Math.min(maxPosition, positionTranslationY);
  } else {
    //todo: It is somewhere here ...
    console.log("oldPosition");
    console.log(oldPosition);
    console.log(positionTranslationY);
    console.log(oldPosition + positionTranslationY);
    return Math.max(0, oldPosition + positionTranslationY);
  }
};

export const getPositionId = (absoluteY) => {
  // "worklet";
  const positionId = Math.round(absoluteY / ELEMENT_HEIGHT);
  console.log("positionId");
  console.log(positionId);
  return positionId;
};

export const getPositionTranslationY = (translationY) => {
  "worklet";
  const positionTranslationY = Math.round(translationY / ELEMENT_HEIGHT);
  // console.log("positionTranslationY");
  // console.log(positionTranslationY);
  return positionTranslationY;
};

export const getPositionY = (position) => {
  "worklet";
  const y = position * ELEMENT_HEIGHT;
  return y;
};
