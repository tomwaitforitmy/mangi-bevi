import { Platform } from "react-native";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useAppTheme } from "../../theme/useAppTheme";
import { NAVIGATION_TITLES } from "../../constants/NavigationTitles";
import { DEV_MODE } from "../../data/Environment";

export default function AuthenticatedTabsLayout() {
  const theme = useAppTheme();

  return (
    <NativeTabs
      // On Android the bar itself is painted theme.colors.primary (see
      // backgroundColor below), so the selected icon stays white for
      // contrast; on iOS the bar has no background of ours to clash with, so
      // the selected icon can be the app's actual primary blue.
      iconColor={{
        default: theme.colors.second,
        selected: theme.colors.headerIconColor,
      }}
      // iOS 26's Liquid Glass is the native tab bar's own material — Apple's
      // HIG says not to paint over it with a custom background. Android has
      // no glass material, so it keeps the brand color there.
      backgroundColor={
        Platform.OS === "android" ? theme.colors.primary : undefined
      }>
      <NativeTabs.Trigger name="meals">
        <NativeTabs.Trigger.Label>
          {NAVIGATION_TITLES.TAB_MEALS}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon
              family={MaterialDesignIcons}
              name="noodles"
            />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="dev" hidden={!DEV_MODE}>
        <NativeTabs.Trigger.Label>
          {NAVIGATION_TITLES.TAB_DEV}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon
                family={Ionicons}
                name="cafe-outline"
              />
            ),
            selected: (
              <NativeTabs.Trigger.VectorIcon family={Ionicons} name="cafe" />
            ),
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="filters">
        <NativeTabs.Trigger.Label>
          {NAVIGATION_TITLES.TAB_FILTERS}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon
                family={Ionicons}
                name="filter-outline"
              />
            ),
            selected: (
              <NativeTabs.Trigger.VectorIcon
                family={Ionicons}
                name="filter"
              />
            ),
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>
          {NAVIGATION_TITLES.TAB_USER_PROFILE}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon
                family={Ionicons}
                name="person-outline"
              />
            ),
            selected: (
              <NativeTabs.Trigger.VectorIcon
                family={Ionicons}
                name="person"
              />
            ),
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="new">
        <NativeTabs.Trigger.Label>
          {NAVIGATION_TITLES.TAB_NEW_MEAL}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon
                family={Ionicons}
                name="create-outline"
              />
            ),
            selected: (
              <NativeTabs.Trigger.VectorIcon
                family={Ionicons}
                name="create"
              />
            ),
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
