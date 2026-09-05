import { LIGHT, DARK, COLORFUL, AUTOMATIC } from "../theme/AppearanceOptions";

export const ResolveAppearance = (selection, deviceColorScheme) => {
  const knownSelections = [LIGHT, DARK, COLORFUL, AUTOMATIC];
  const effectiveSelection = knownSelections.includes(selection)
    ? selection
    : AUTOMATIC;

  if (effectiveSelection !== AUTOMATIC) {
    return effectiveSelection;
  }

  return deviceColorScheme === DARK ? DARK : LIGHT;
};
