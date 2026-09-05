import React, { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperProvider } from "react-native-paper";
import {
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme as NavDefaultTheme,
} from "expo-router";
import { ResolveAppearance } from "../common_functions/ResolveAppearance";
import { AUTOMATIC, LIGHT, DARK, COLORFUL, STORAGE_KEY } from "./AppearanceOptions";
import { AppearanceSelectionContext } from "./useAppearanceSelection";
import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";
import colorfulTheme from "./colorfulTheme";

const paperThemesByName = {
  [LIGHT]: lightTheme,
  [DARK]: darkTheme,
  [COLORFUL]: colorfulTheme,
};

// Bridges our Paper theme's colors into React Navigation's theme shape
// (dark, colors.{primary,background,card,text,border,notification}, fonts)
// so native-stack chrome (headers, tab bar) matches, per CLAUDE.md's
// mandatory expo-router import rule (never @react-navigation/* directly).
const toNavigationTheme = (paperTheme) => ({
  dark: paperTheme.dark,
  colors: {
    primary: paperTheme.colors.primary,
    background: paperTheme.colors.background,
    card: paperTheme.colors.surface,
    text: paperTheme.colors.onSurface,
    border: paperTheme.colors.outline,
    notification: paperTheme.colors.error,
  },
  fonts: NavDefaultTheme.fonts,
});

export default function ThemeProvider({ children }) {
  const deviceColorScheme = useColorScheme();
  const [selection, setSelectionState] = useState(AUTOMATIC);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (isMounted && stored) {
        setSelectionState(stored);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const setSelection = useCallback((next) => {
    setSelectionState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const resolvedName = ResolveAppearance(selection, deviceColorScheme);
  const paperTheme = paperThemesByName[resolvedName];

  return (
    <AppearanceSelectionContext.Provider value={{ selection, setSelection }}>
      <PaperProvider theme={paperTheme}>
        <NavigationThemeProvider value={toNavigationTheme(paperTheme)}>
          {children}
        </NavigationThemeProvider>
      </PaperProvider>
    </AppearanceSelectionContext.Provider>
  );
}
