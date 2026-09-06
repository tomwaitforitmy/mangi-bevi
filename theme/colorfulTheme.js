import { Platform } from "react-native";
import { MD3LightTheme } from "react-native-paper";

const primary = "#7C3AED";

// See theme/lightTheme.js for the token-shape and ink/paper-role rationale.
// A vibrant third appearance (User Story 2) — violet/coral on a warm cream
// ground — built on the light MD3 base since it's a light-background theme,
// but with its own genuinely distinct identity, not a tinted copy of
// lightTheme.js.
export default {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary,
    onPrimary: "#FFFFFF",
    second: "#D6304B",
    background: "#FFF7ED",
    onBackground: "#241832",
    surface: "#FFFFFF",
    onSurface: "#241832",
    surfaceVariant: "#F3E8FF",
    onSurfaceVariant: "#4C3575",
    outline: "#8B5FBF",

    // Ink/paper roles (see theme/lightTheme.js)
    black: "#241832",
    white: "#FFFFFF",
    gray: "#D8CBEA",

    navigationIcon: "#FFFFFF",
    speedDialIcon: "#FFFFFF",
    speedDialActionBackground: "#C22641",
    speedDialActionText: "#FFFFFF",
    speedDialBackground: "#C22641",
    screenBackGround: "#FFF7ED",
    hyperlink: primary,
    levelViewBackground: "#FFFFFF",
    levelViewBarBackground: "#FEF3C7",
    levelViewBar: "#92400E",
    levelViewBarBackgroundBorder: "#7A3009",
    levelViewTexts: "#241832",
    searchTextPlaceholder: "#6B5B85",
    searchTermHighlight: "#C22641",
    selectedMealBackground: "#F3E8FF",
    selectedMealBorderColor: "#C9A4F5",
    transparent: "rgba(0, 0, 0, 0.0)",
    myTabMenuBackground: "#DFC7F7",
    myTabMenuSelectedBackground: "#FFFFFF",
    textInputBackground: primary,
    textInputPlaceholderColor: "#F3E8FF",
    headerIconColor: Platform.OS === "ios" ? primary : "#FFFFFF",
    tagBackground: "#FFFFFF",
    tagText: "#241832",
    tagBorderColor: "rgba(36,24,50,0.14)",
    ratingStar: "#FFD700",
    primaryOverlay: "rgba(124, 58, 237, 0.7)",
  },
};
