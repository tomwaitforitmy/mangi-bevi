import { Stack } from "expo-router";
import SendReportScreen from "../../../../../screens/SendReportScreen";
import GlobalBackIcon from "../../../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function ReportRoute() {
  return (
    <>
      <Stack.Screen
        options={{ title: "Report", headerLeft: GlobalBackButtonComponent }}
      />
      <SendReportScreen />
    </>
  );
}
