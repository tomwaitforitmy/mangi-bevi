import { Stack } from "expo-router";
import MealsScreen from "../../../screens/MealsScreen";

export default function MealsIndexRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Mangi & Bevi" }} />
      <MealsScreen />
    </>
  );
}
