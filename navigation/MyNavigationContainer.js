import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import MealDeatailScreen from "../screens/MealDeatailScreen";

const MyStack = createNativeStackNavigator();

const MyNavigationContainer = (props) => {
  return (
    <NavigationContainer>
      <MyStack.Navigator>
        <MyStack.Screen name="Home" component={HomeScreen} />
        <MyStack.Screen name="Details" component={MealDeatailScreen} />
      </MyStack.Navigator>
    </NavigationContainer>
  );
};

export default MyNavigationContainer;
