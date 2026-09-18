import { Stack } from "expo-router";
import AboutScreen from "../../../screens/AboutScreen";
import GlobalBackIcon from "../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function ProfileAboutRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "About",
          headerLeft: GlobalBackButtonComponent,
        }}
      />
      <AboutScreen />
    </>
  );
}
