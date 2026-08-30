import { Platform } from "react-native";
import { Tabs } from "expo-router";
import Colors from "../../constants/Colors";
import TabBarIcon from "../../components/HeaderIcons/TabBarIcon";
import { NAVIGATION_TITLES } from "../../constants/NavigationTitles";
import { DEV_MODE } from "../../data/Environment";
import { defaultScreenOptions } from "../../constants/DefaultScreenOptions";

export default function AuthenticatedTabsLayout() {
  return (
    <Tabs
      activeColor={Colors.navigationIcon}
      inactiveColor={Colors.second}
      //it was mentioned on github, that this should be false on iOS
      //and true on android to make keyboardAvoidingView work with material-bottom-tabs
      keyboardHidesNavigationBar={Platform.OS === "ios" ? false : true}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.primary,
        },
        tabBarActiveTintColor: Colors.navigationIcon,
        tabBarInactiveTintColor: Colors.second,
      }}>
      <Tabs.Screen
        name="meals"
        options={{
          title: NAVIGATION_TITLES.TAB_MEALS,
          headerShown: false, // this tab owns its own nested Stack with a real header
          tabBarIcon: ({ focused, color }) =>
            TabBarIcon(focused, color, NAVIGATION_TITLES.TAB_MEALS),
        }}
      />
      <Tabs.Screen
        name="dev"
        options={{
          ...defaultScreenOptions,
          title: NAVIGATION_TITLES.TAB_DEV,
          tabBarIcon: ({ focused, color }) =>
            TabBarIcon(focused, color, NAVIGATION_TITLES.TAB_DEV),
          href: DEV_MODE ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="filters"
        options={{
          ...defaultScreenOptions,
          title: NAVIGATION_TITLES.TAB_FILTERS,
          tabBarIcon: ({ focused, color }) =>
            TabBarIcon(focused, color, NAVIGATION_TITLES.TAB_FILTERS),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: NAVIGATION_TITLES.TAB_USER_PROFILE,
          headerShown: false, // this tab owns its own nested Stack with a real header
          tabBarIcon: ({ focused, color }) =>
            TabBarIcon(focused, color, NAVIGATION_TITLES.TAB_USER_PROFILE),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          ...defaultScreenOptions,
          title: NAVIGATION_TITLES.TAB_NEW_MEAL,
          tabBarIcon: ({ focused, color }) =>
            TabBarIcon(focused, color, NAVIGATION_TITLES.TAB_NEW_MEAL),
        }}
      />
    </Tabs>
  );
}
