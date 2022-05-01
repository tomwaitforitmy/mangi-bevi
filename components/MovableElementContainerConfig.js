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

export const getNewPosition = (
  oldPosition,
  positionTranslationY,
  maxPosition
) => {
  // "worklet";
  const newPos = positionTranslationY;
  console.log("newPos");
  console.log(newPos);

  const result = Math.max(0, Math.min(newPos, maxPosition));
  console.log("result");
  console.log(result);
  return result;
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
