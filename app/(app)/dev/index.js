import { Stack } from "expo-router";
import DevScreen from "../../../screens/DevScreen";
import { NAVIGATION_TITLES } from "../../../constants/NavigationTitles";

export default function DevIndexRoute() {
  return (
    <>
      <Stack.Screen options={{ title: NAVIGATION_TITLES.TAB_DEV }} />
      <DevScreen />
    </>
  );
}
