import { Stack } from "expo-router";
import LoginScreen from "../../screens/LoginScreen";
import GlobalBackIcon from "../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function LoginRoute() {
  return (
    <>
      <Stack.Screen
        options={{ title: "Login", headerLeft: GlobalBackButtonComponent }}
      />
      <LoginScreen />
    </>
  );
}
