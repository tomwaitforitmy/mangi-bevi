import { Stack } from "expo-router";
import FiltersScreen from "../../../screens/FiltersScreen";
import { NAVIGATION_TITLES } from "../../../constants/NavigationTitles";

export default function FiltersIndexRoute() {
  return (
    <>
      <Stack.Screen options={{ title: NAVIGATION_TITLES.TAB_FILTERS }} />
      <FiltersScreen />
    </>
  );
}
