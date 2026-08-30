import { Stack } from "expo-router";
import DebugScreen from "../screens/DebugScreen";

export default function DebugRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Debug screen" }} />
      <DebugScreen />
    </>
  );
}
