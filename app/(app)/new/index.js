import { Stack } from "expo-router";
import NewScreen from "../../../screens/NewScreen";
import { NAVIGATION_TITLES } from "../../../constants/NavigationTitles";

export default function NewIndexRoute() {
  return (
    <>
      <Stack.Screen options={{ title: NAVIGATION_TITLES.TAB_NEW_MEAL }} />
      <NewScreen />
    </>
  );
}
