import { Stack } from "expo-router";
import { getDefaultScreenOptions } from "../../../constants/DefaultScreenOptions";
import { useAppTheme } from "../../../theme/useAppTheme";

export default function MealsStackLayout() {
  const theme = useAppTheme();
  return <Stack screenOptions={getDefaultScreenOptions(theme)} />;
}
