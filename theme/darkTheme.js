import { Platform } from "react-native";
import { MD3DarkTheme } from "react-native-paper";

// See theme/lightTheme.js for the token-shape and ink/paper-role rationale.
// This is a genuine dark palette (near-black layered surfaces, a lightened/
// desaturated primary for eye comfort) — not an automatic inversion of
// lightTheme.js.
export default {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#8FB8FF",
    onPrimary: "#0B1F44",
    second: "#3FC6FF",
    background: "#121317",
    onBackground: "#E7E9EC",
    surface: "#1B1D22",
    onSurface: "#E7E9EC",
    surfaceVariant: "#33363C",
    onSurfaceVariant: "#C4C8D0",
    outline: "#8B8F98",

    // Ink/paper roles (see theme/lightTheme.js) — inverted here on purpose.
    black: "#ECEDF0",
    white: "#1B1D22",
    gray: "#4B4F58",

    navigationIcon: "#0B1F44",
    speedDialIcon: "#0B1F44",
    speedDialActionBackground: "#8FB8FF",
    speedDialActionText: "#0B1F44",
    speedDialBackground: "#8FB8FF",
    screenBackGround: "#121317",
    hyperlink: "#9DBCFF",
    levelViewBackground: "#20232A",
    levelViewBarBackground: "#173A26",
    levelViewBar: "#8FE3AE",
    levelViewBarBackgroundBorder: "#B7F5CE",
    levelViewTexts: "#E7E9EC",
    searchTextPlaceholder: "#9AA0AC",
    searchTermHighlight: "#FF9A73",
    selectedMealBackground: "#1E2A44",
    selectedMealBorderColor: "#33456E",
    transparent: "rgba(0, 0, 0, 0.0)",
    myTabMenuBackground: "#20232A",
    textInputBackground: "#8FB8FF",
    textInputPlaceholderColor: "#132241",
    headerIconColor: Platform.OS === "ios" ? "#8FB8FF" : "#0B1F44",
    tagBackground: "#24272E",
    tagText: "#E7E9EC",
    tagBorderColor: "rgba(231,233,236,0.16)",
    ratingStar: "#FFD700",
    primaryOverlay: "rgba(143, 184, 255, 0.7)",
  },
};
