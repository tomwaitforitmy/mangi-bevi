import { Stack } from "expo-router";
import UserMealsScreen from "../../../screens/UserMealsScreen";
import GlobalBackIcon from "../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function ProfileMealsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Mangis",
          headerLeft: GlobalBackButtonComponent,
        }}
      />
      <UserMealsScreen />
    </>
  );
}
