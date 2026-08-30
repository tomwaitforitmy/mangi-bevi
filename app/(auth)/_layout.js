import { Stack } from "expo-router";
import { defaultScreenOptions } from "../../constants/DefaultScreenOptions";

export default function AuthStackLayout() {
  return <Stack screenOptions={defaultScreenOptions} />;
}
