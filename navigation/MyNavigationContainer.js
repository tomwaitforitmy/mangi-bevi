import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import MealDeatailScreen from "../screens/MealDeatailScreen";

const MyStack = createNativeStackNavigator();

const MyNavigationContainer = (props) => {
  return (
    <NavigationContainer>
      <MyStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
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
          component={MealDeatailScreen}
          options={{ title: "My Details" }}
        />
      </MyStack.Navigator>
    </NavigationContainer>
  );
};

export default MyNavigationContainer;
