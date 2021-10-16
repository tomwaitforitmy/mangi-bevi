import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";

export const IsNativeFeedbackSupported = () => {
  return Platform.OS === "android" && Platform.Version >= 21;
};

export const GetTouchableComponentForAnyOS = () => {
  if (IsNativeFeedbackSupported()) {
    return TouchableNativeFeedback;
  }
  console.log("Fallback to TouchableOpacity");
  return TouchableOpacity;
};
