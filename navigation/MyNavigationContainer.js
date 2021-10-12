import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import FiltersScreen from "../screens/FiltersScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import NewScreen from "../screens/NewScreen";
import Colors from "../constants/Colors";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: "yellow",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator screenOptions={defaultScreenOptions}>
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Filters" component={FiltersScreen} />
      <Tab.Screen name="New" component={NewScreen} />
    </Tab.Navigator>
  );
}

const MyStack = createNativeStackNavigator();

function HomeStack({ route }) {
  return (
    <MyStack.Navigator screenOptions={defaultScreenOptions}>
      <MyStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <MyStack.Screen
        name="Details"
        component={MealDetailScreen}
        options={({ route }) => ({ title: route.params.mealTitle })}
      />
    </MyStack.Navigator>
  );
}

const MyNavigationContainer = (props) => {
  return (
    <NavigationContainer>
      <MyTabs></MyTabs>
    </NavigationContainer>
  );
};

export default MyNavigationContainer;
