import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealsScreen from "../screens/MealsScreen";
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
  headerTintColor: Colors.white,
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const Tab = createMaterialBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      activeColor={Colors.white}
      inactiveColor={Colors.second}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Mangi & Bevi") {
            iconName = focused ? "ios-restaurant" : "ios-restaurant-outline";
          } else if (route.name === "Filters") {
            iconName = focused ? "ios-filter" : "ios-filter-outline";
          } else if (route.name === "New") {
            iconName = focused ? "ios-create" : "ios-create-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "ios-star" : "ios-star-outline";
          }

          return <Ionicons name={iconName} size={25} color={color} />;
        },

        tabBarColor: Colors.primary,
      })}
    >
      <Tab.Screen name="Mangi & Bevi" component={MealsStackContainer} />
      <Tab.Screen name="Favorites" component={FavoritesStackContainer} />
      <Tab.Screen name="Filters" component={FiltersScreen} />
      <Tab.Screen name="New" component={NewScreen} />
    </Tab.Navigator>
  );
}

const MealsStack = createNativeStackNavigator();

function MealsStackContainer({ route }) {
  return (
    <MealsStack.Navigator screenOptions={defaultScreenOptions}>
      <MealsStack.Screen
        name="Meals"
        component={MealsScreen}
        options={{ title: "Meals" }}
      />
      <MealsStack.Screen
        name="Details"
        component={MealDetailScreen}
        options={({ route }) => ({ title: route.params.mealTitle })}
      />
    </MealsStack.Navigator>
  );
}

const FavoritesStack = createNativeStackNavigator();

function FavoritesStackContainer({ route }) {
  return (
    <FavoritesStack.Navigator screenOptions={defaultScreenOptions}>
      <FavoritesStack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
    </FavoritesStack.Navigator>
  );
}

const MyNavigationContainer = (props) => {
  return (
    <NavigationContainer>
      <MainTabNavigator></MainTabNavigator>
    </NavigationContainer>
  );
};

export default MyNavigationContainer;
