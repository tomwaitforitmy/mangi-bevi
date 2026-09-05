import { createContext, useContext } from "react";
import { AUTOMATIC } from "./AppearanceOptions";

// Provided by theme/ThemeProvider.js, which owns the single source of truth
// (state + AsyncStorage persistence) so every consumer of this hook shares
// the same selection instead of each holding an independent copy.
export const AppearanceSelectionContext = createContext({
  selection: AUTOMATIC,
  setSelection: () => {},
});

export const useAppearanceSelection = () => useContext(AppearanceSelectionContext);
