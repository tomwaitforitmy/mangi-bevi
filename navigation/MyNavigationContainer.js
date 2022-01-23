import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealsScreen from "../screens/MealsScreen";
import FiltersScreen from "../screens/FiltersScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import NewScreen from "../screens/NewScreen";
import Colors from "../constants/Colors";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Icon } from "react-native-elements";
import ImagesScreen from "../screens/ImagesScreen";

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
      activeColor={Colors.navigationIcon}
      inactiveColor={Colors.second}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Mangi & Bevi") {
            return (
              <MaterialCommunityIcons
                name={"noodles"}
                size={25}
                color={color}
              />
            );
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
      <Tab.Screen name="New" component={NewMealStackContainer} />
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
        options={({ navigation, route }) => ({
          title: "  Mangi & Bevi",
          headerLeft: () => (
            <MaterialCommunityIcons
              name={"noodles"}
              size={25}
              color={Colors.navigationIcon}
              onPress={
                () => {}
                // navigation.navigate("EditScreen", {
                //   mealId: route.params.mealId,
                // })
              }
            />
          ),
        })}
      />
      <MealsStack.Screen
        name="Details"
        component={MealDetailScreen}
        options={({ navigation, route }) => ({
          title: route.params.mealTitle,
          headerRight: () => (
            <Icon
              name={"create-outline"}
              onPress={() =>
                navigation.navigate("EditScreen", {
                  mealId: route.params.mealId,
                })
              }
              type="ionicon"
              color={Colors.navigationIcon}
            />
          ),
        })}
      />
      <MealsStack.Screen
        name="EditScreen"
        component={NewScreen}
        options={{ title: "Edit Mangi / Bevi" }}
      />
      <MealsStack.Screen
        name="ImagesScreen"
        component={ImagesScreen}
        options={({ navigation, route }) => ({
          title: route.params.mealTitle,
          headerRight: () => (
            <Icon
              name={"create-outline"}
              onPress={() =>
                navigation.navigate("EditScreen", {
                  mealId: route.params.mealId,
                })
              }
              type="ionicon"
              color={Colors.navigationIcon}
            />
          ),
        })}
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

const NewMealStack = createNativeStackNavigator();

function NewMealStackContainer({ route }) {
  return (
    <NewMealStack.Navigator screenOptions={defaultScreenOptions}>
      <NewMealStack.Screen
        name="NewScreen"
        component={NewScreen}
        options={{ title: "New Mangi / Bevi" }}
      />
    </NewMealStack.Navigator>
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
