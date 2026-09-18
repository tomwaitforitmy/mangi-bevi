import { Stack } from "expo-router";
import CostsScreen from "../../../screens/CostsScreen";
import GlobalBackIcon from "../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function ProfileAboutCostsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Costs & Transparency",
          headerLeft: GlobalBackButtonComponent,
        }}
      />
      <CostsScreen />
    </>
  );
}
