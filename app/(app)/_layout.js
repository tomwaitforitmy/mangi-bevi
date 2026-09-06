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
      // Same color scheme on both platforms now, matching iOS's look: brand
      // primary for the selected icon/label, "second" for inactive — these
      // are designed for contrast against a neutral surface, not a painted
      // brand-color bar (that mismatch was the earlier Android readability
      // bug: "second" barely shows up against a primary-colored background).
      iconColor={{
        default: theme.colors.second,
        selected: theme.colors.primary,
      }}
      labelStyle={{
        default: { color: theme.colors.second },
        selected: { color: theme.colors.primary },
      }}
      // Android-only "pill" behind the selected icon; a light primary tint
      // keeps it on-brand while giving more contrast than the mismatched
      // default. No iOS equivalent to match — iOS has no such indicator.
      indicatorColor={theme.colors.selectedMealBackground}
      // iOS 26's Liquid Glass is the native tab bar's own material — Apple's
      // HIG says not to paint over it with a custom background. Android has
      // no glass material; theme.colors.surface is its closest neutral
      // equivalent, replacing the old brand-colored bar.
      backgroundColor={
        Platform.OS === "android" ? theme.colors.surface : undefined
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
