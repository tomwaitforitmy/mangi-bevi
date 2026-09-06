import { Platform } from "react-native";
import { MD3DarkTheme } from "react-native-paper";

const primary = "#7EC8FF";

// - Sky Signal #7EC8FF — safest choice, closest lift of your current light-mode blue
// - Dusk Iris #A5B4FC — blue drifted toward violet, more distinctive
// - Pomodoro #FF8A80 — soft coral red (named for the tomato)
// - Basil #6EE7B7 — fresh mint green (named for the herb)
// - Saffron #FCD34D — golden yellow (named for the spice)
// https://claude.ai/code/artifact/c99c18b4-48ef-4fdf-b2da-7f31d1cc8420

// See theme/lightTheme.js for the token-shape and ink/paper-role rationale.
// This is a genuine dark palette (near-black layered surfaces, a lightened/
// desaturated primary for eye comfort) — not an automatic inversion of
// lightTheme.js.
export default {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary,
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
    speedDialActionBackground: primary,
    speedDialActionText: "#0B1F44",
    speedDialBackground: primary,
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
    textInputBackground: primary,
    textInputPlaceholderColor: "#132241",
    headerIconColor: Platform.OS === "ios" ? primary : "#0B1F44",
    tagBackground: "#24272E",
    tagText: "#E7E9EC",
    tagBorderColor: "rgba(231,233,236,0.16)",
    ratingStar: "#FFD700",
    primaryOverlay: "rgba(143, 184, 255, 0.7)",
  },
};
