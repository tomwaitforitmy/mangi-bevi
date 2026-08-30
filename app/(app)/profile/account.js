import { Stack } from "expo-router";
import ManageAccountScreen from "../../../screens/ManageAccountScreen";
import GlobalBackIcon from "../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function ProfileAccountRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Account",
          headerLeft: GlobalBackButtonComponent,
        }}
      />
      <ManageAccountScreen />
    </>
  );
}
