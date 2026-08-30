import { Stack } from "expo-router";
import ProfileScreen from "../../../screens/ProfileScreen";
import LogoutIcon from "../../../components/HeaderIcons/LogoutIcon";

export default function ProfileIndexRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Data",
          headerRight: () => <LogoutIcon />,
        }}
      />
      <ProfileScreen />
    </>
  );
}
