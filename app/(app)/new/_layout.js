import { Stack } from "expo-router";
import { defaultScreenOptions } from "../../../constants/DefaultScreenOptions";

export default function NewStackLayout() {
  return <Stack screenOptions={defaultScreenOptions} />;
}
