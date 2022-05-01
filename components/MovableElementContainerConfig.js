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

export const getNewPosition = (
  oldPosition,
  positionTranslationY,
  maxPosition
) => {
  "worklet";
  const newPos = oldPosition + positionTranslationY;

  if (positionTranslationY < 0) {
    return Math.max(0, newPos);
  } else if (positionTranslationY > 0) {
    return Math.min(maxPosition, newPos);
  } else {
    return oldPosition; //no change
  }
};

export const getPositionTranslationY = (translationY) => {
  "worklet";
  return Math.round(translationY / ELEMENT_HEIGHT);
};

export const getPositionY = (position) => {
  "worklet";
  const y = position * ELEMENT_HEIGHT;
  return y;
};
