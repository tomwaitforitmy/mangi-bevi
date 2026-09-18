import { Stack } from "expo-router";
import OpenSourceLicensesScreen from "../../../screens/OpenSourceLicensesScreen";
import GlobalBackIcon from "../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function ProfileAboutLicensesRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Open Source Licenses",
          headerLeft: GlobalBackButtonComponent,
        }}
      />
      <OpenSourceLicensesScreen />
    </>
  );
}
