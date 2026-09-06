import { Platform } from "react-native";
import { MD3LightTheme } from "react-native-paper";

const primary = "#0B63F6";

// Extends React Native Paper's stock MD3 light theme with the app's brand
// colors and every app-specific token that used to live in
// constants/Colors.js (see contracts/theme-api.md — this token set is a
// strict superset so migrating a call site is a mechanical rename).
//
// `black`/`white`/`gray` are kept as *role* names, not literal colors: they
// carry over from the old Colors.js naming so migrated files barely change,
// but each theme defines its own value for the role. `black` is the
// maximally-emphasized "ink" color (dark here, light in darkTheme.js) and
// `white` is the maximally-receding "paper" color (light here, dark in
// darkTheme.js) — never assume `black` is literally #000.
export default {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary,
    onPrimary: "#FFFFFF",
    second: "#0B74B8",
    background: "#F5F7FB",
    onBackground: "#1B1D22",
    surface: "#FFFFFF",
    onSurface: "#1B1D22",
    surfaceVariant: "#E7ECF5",
    onSurfaceVariant: "#43474E",
    outline: "#73777F",

    // Ink/paper roles (see file header)
    black: "#1B1D22",
    white: "#FFFFFF",
    gray: "#C7CBD1",

    navigationIcon: "#FFFFFF",
    speedDialIcon: "#FFFFFF",
    speedDialActionBackground: primary,
    speedDialActionText: "#FFFFFF",
    speedDialBackground: primary,
    screenBackGround: "#F5F7FB",
    hyperlink: "#1D4FD8",
    levelViewBackground: "#FFFFFF",
    levelViewBarBackground: "#DFF7E8",
    levelViewBar: "#0F7A34",
    levelViewBarBackgroundBorder: "#0B5C27",
    levelViewTexts: "#1B1D22",
    searchTextPlaceholder: "#5B6069",
    searchTermHighlight: "#C4401A",
    selectedMealBackground: "#E7F0FF",
    selectedMealBorderColor: "#B9CFFA",
    transparent: "rgba(0, 0, 0, 0.0)",
    myTabMenuBackground: "#D5DBE8",
    myTabMenuSelectedBackground: "#FFFFFF",
    // Login/signup screen's full-screen gradient. Same as second/primary
    // here (already reads well against a light background) — only dark
    // mode needed dedicated, deliberately muted values (see darkTheme.js).
    authGradientStart: "#0B74B8",
    authGradientEnd: "#0B63F6",
    authOnGradient: "#FFFFFF",
    textInputBackground: primary,
    textInputPlaceholderColor: "#F4F7FF",
    headerIconColor: Platform.OS === "ios" ? primary : "#FFFFFF",
    tagBackground: "#FFFFFF",
    tagText: "#1B1D22",
    tagBorderColor: "rgba(27,29,34,0.12)",
    ratingStar: "#FFD700",
    primaryOverlay: "rgba(11, 99, 246, 0.7)",
  },
};
