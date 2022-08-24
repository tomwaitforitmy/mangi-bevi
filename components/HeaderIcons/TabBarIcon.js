import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TabBarIcon = (focused, color, routeName) => {
  let iconName;

  if (routeName === "Mangi & Bevi") {
    return <MaterialCommunityIcons name={"noodles"} size={25} color={color} />;
  } else if (routeName === "Filters") {
    iconName = focused ? "ios-filter" : "ios-filter-outline";
  } else if (routeName === "New") {
    iconName = focused ? "ios-create" : "ios-create-outline";
  } else if (routeName === "Profile") {
    iconName = focused ? "person" : "person-outline";
  } else if (routeName === "Dev") {
    iconName = focused ? "cafe" : "cafe-outline";
  }

  return <Ionicons name={iconName} size={25} color={color} />;
};

export default TabBarIcon;
