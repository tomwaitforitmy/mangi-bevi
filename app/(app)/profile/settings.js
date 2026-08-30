import { Stack } from "expo-router";
import SettingsScreen from "../../../screens/SettingsScreen";
import GlobalBackIcon from "../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function ProfileSettingsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Settings",
          headerLeft: GlobalBackButtonComponent,
        }}
      />
      <SettingsScreen />
    </>
  );
}
