import { Stack } from "expo-router";
import MealsScreenNotAuthenticated from "../../screens/MealsScreenNotAuthenticated";

export default function AuthMealsIndexRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Mangi & Bevi" }} />
      <MealsScreenNotAuthenticated />
    </>
  );
}
