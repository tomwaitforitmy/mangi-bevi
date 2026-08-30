import { Stack } from "expo-router";
import SignUpScreen from "../../screens/SignUpScreen";
import GlobalBackIcon from "../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function SignUpRoute() {
  return (
    <>
      <Stack.Screen
        options={{ title: "Sign Up", headerLeft: GlobalBackButtonComponent }}
      />
      <SignUpScreen />
    </>
  );
}
