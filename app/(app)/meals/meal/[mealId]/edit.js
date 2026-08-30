import { Stack } from "expo-router";
import NewScreen from "../../../../../screens/NewScreen";
import GlobalBackIcon from "../../../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function MealEditRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Mangi / Bevi",
          gestureEnabled: false,
          headerLeft: GlobalBackButtonComponent,
        }}
      />
      <NewScreen />
    </>
  );
}
