import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealsScreen from "../screens/MealsScreen";
import FiltersScreen from "../screens/FiltersScreen";
import DevScreen from "../screens/DevScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import NewScreen from "../screens/NewScreen";
import Colors from "../constants/Colors";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Icon } from "react-native-elements";
import ImagesScreen from "../screens/ImagesScreen";
import AddTagScreen from "../screens/AddTagScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/authAction";
import {
  LoadCredentials,
  LoadToken,
} from "../common_functions/CredentialStorage";
import AppLoading from "expo-app-loading";
import { View } from "react-native";

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

function AuthenticatedTabNavigator() {
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
          } else if (route.name === "Dev") {
            iconName = focused ? "cafe" : "cafe-outline";
          }

          return <Ionicons name={iconName} size={25} color={color} />;
        },

        tabBarColor: Colors.primary,
      })}
    >
      <Tab.Screen name="Mangi & Bevi" component={MealsStackContainer} />
      {false && <Tab.Screen name="Dev" component={DevStackContainer} />}
      <Tab.Screen name="Filters" component={FiltersStackContainer} />
      <Tab.Screen name="New" component={NewMealStackContainer} />
    </Tab.Navigator>
  );
}

const MealsStack = createNativeStackNavigator();

function MealsStackContainer({ route }) {
  const dispatch = useDispatch();

  return (
    // See https://stackoverflow.com/questions/70341930/screens-dont-render-on-material-bottom-tab-navigator-since-upgrading-to-expo-sd/70998392#comment127025978_70998392
    <View style={{ flex: 1 }} collapsable={false}>
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
              />
            ),
            headerRight: () => (
              <Ionicons
                name={"exit-outline"}
                size={25}
                color={Colors.navigationIcon}
                onPress={() => {
                  dispatch(authActions.logout());
                }}
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
        <MealsStack.Screen
          name="AddTagScreen"
          component={AddTagScreen}
          options={{ title: "Add Tag" }}
        />
      </MealsStack.Navigator>
    </View>
  );
}

const DevStack = createNativeStackNavigator();

function DevStackContainer({ route }) {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <DevStack.Navigator screenOptions={defaultScreenOptions}>
        <DevStack.Screen
          name="DevScreem"
          component={DevScreen}
          options={{ title: "Dev" }}
        />
      </DevStack.Navigator>
    </View>
  );
}

const LoginStack = createNativeStackNavigator();

function LoginStackContainer({ route }) {
  return (
    <LoginStack.Navigator screenOptions={defaultScreenOptions}>
      <LoginStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <LoginStack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ title: "Sign Up" }}
      />
    </LoginStack.Navigator>
  );
}

const FiltersStack = createNativeStackNavigator();

function FiltersStackContainer({ route }) {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <FiltersStack.Navigator screenOptions={defaultScreenOptions}>
        <FiltersStack.Screen
          name="FiltersScreen"
          component={FiltersScreen}
          options={{ title: "Filters" }}
        />
      </FiltersStack.Navigator>
    </View>
  );
}

const NewMealStack = createNativeStackNavigator();

function NewMealStackContainer({ route }) {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <NewMealStack.Navigator screenOptions={defaultScreenOptions}>
        <NewMealStack.Screen
          name="NewScreen"
          component={NewScreen}
          options={{ title: "New Mangi / Bevi" }}
        />
      </NewMealStack.Navigator>
    </View>
  );
}

const MyNavigationContainer = (props) => {
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = !!token;
  console.log("isAuthenticated " + isAuthenticated);
  const [isTryingLogin, setIsTryingLogin] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      setIsTryingLogin(true);
      const tokenData = await LoadToken();

      if (!!tokenData) {
        dispatch(
          authActions.authenticate(
            tokenData.token,
            tokenData.userId,
            tokenData.experiationTime
          )
        );
        setIsTryingLogin(false);

        return;
      }

      const credentials = await LoadCredentials();

      if (!!credentials) {
        dispatch(authActions.login(credentials.email, credentials.password));
      }
      setIsTryingLogin(false);
    };
    tryLogin();
  }, [dispatch]);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated && <LoginStackContainer></LoginStackContainer>}
      {isAuthenticated && (
        <AuthenticatedTabNavigator></AuthenticatedTabNavigator>
      )}
    </NavigationContainer>
  );
};

export default MyNavigationContainer;
