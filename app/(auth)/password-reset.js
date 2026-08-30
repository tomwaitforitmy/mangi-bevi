import { Stack } from "expo-router";
import PasswordResetScreen from "../../screens/PasswordResetScreen";
import GlobalBackIcon from "../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function PasswordResetRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Reset Password",
          headerLeft: GlobalBackButtonComponent,
        }}
      />
      <PasswordResetScreen />
    </>
  );
}
