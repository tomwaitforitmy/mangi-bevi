import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import Colors from "../constants/Colors";

const MyStack = createNativeStackNavigator();

const MyNavigationContainer = (props) => {
  return (
    <NavigationContainer>
      <MyStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
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
    </NavigationContainer>
  );
};

export default MyNavigationContainer;
