import { Stack } from "expo-router";
import EditFriendsScreen from "../../../screens/EditFriendsScreen";
import GlobalBackIcon from "../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function ProfileFriendsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Friends",
          headerLeft: GlobalBackButtonComponent,
        }}
      />
      <EditFriendsScreen />
    </>
  );
}
