import { Stack } from "expo-router";
import EditLinksScreen from "../../../../../screens/EditLinksScreen";
import GlobalBackIcon from "../../../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function EditLinksRoute() {
  return (
    <>
      <Stack.Screen
        options={{ title: "Add Links", headerLeft: GlobalBackButtonComponent }}
      />
      <EditLinksScreen />
    </>
  );
}
