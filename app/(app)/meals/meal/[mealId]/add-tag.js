import { Stack } from "expo-router";
import AddTagScreen from "../../../../../screens/AddTagScreen";
import GlobalBackIcon from "../../../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function AddTagRoute() {
  return (
    <>
      <Stack.Screen
        options={{ title: "Add Tag", headerLeft: GlobalBackButtonComponent }}
      />
      <AddTagScreen />
    </>
  );
}
