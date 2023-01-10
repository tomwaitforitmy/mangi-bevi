import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealsScreen from "../screens/MealsScreen";
import FiltersScreen from "../screens/FiltersScreen";
import DevScreen from "../screens/DevScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import NewScreen from "../screens/NewScreen";
import Colors from "../constants/Colors";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
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
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import ProfileScreen from "../screens/ProfileScreen";
import UserMealsScreen from "../screens/UserMealsScreen";
import LogoutIcon from "../components/HeaderIcons/LogoutIcon";
import NoodlesIcon from "../components/HeaderIcons/NoodlesIcon";
import EditMangiIcon from "../components/HeaderIcons/EditMangiIcon";
import TabBarIcon from "../components/HeaderIcons/TabBarIcon";

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
const devMode = false;

function AuthenticatedTabNavigator() {
  return (
    <Tab.Navigator
      activeColor={Colors.navigationIcon}
      inactiveColor={Colors.second}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) =>
          TabBarIcon(focused, color, route.name),
        tabBarColor: Colors.primary,
      })}>
      <Tab.Screen name="Mangi & Bevi" component={MealsStackContainer} />
      {devMode && <Tab.Screen name="Dev" component={DevStackContainer} />}
      <Tab.Screen name="Filters" component={FiltersStackContainer} />
      <Tab.Screen name="Profile" component={ProfileStackContainer} />
      <Tab.Screen name="New" component={NewMealStackContainer} />
    </Tab.Navigator>
  );
}

const MealsStack = createNativeStackNavigator();

function MealsStackContainer({ navigation }) {
  const dispatch = useDispatch();

  return (
    // See https://stackoverflow.com/questions/70341930/screens-dont-render-on-material-bottom-tab-navigator-since-upgrading-to-expo-sd/70998392#comment127025978_70998392
    <View style={{ flex: 1 }} collapsable={false}>
      <MealsStack.Navigator screenOptions={defaultScreenOptions}>
        <MealsStack.Screen
          name="Meals"
          component={MealsScreen}
          options={{
            title: "  Mangi & Bevi",
            headerLeft: () => NoodlesIcon(),
            headerRight: () => LogoutIcon(dispatch, devMode, navigation),
          }}
        />
        <MealsStack.Screen
          name="Details"
          component={MealDetailScreen}
          options={({ route }) => ({
            title: route.params.mealTitle,
            headerRight: () => EditMangiIcon(navigation, route.params.mealId),
          })}
        />
        <MealsStack.Screen
          name="EditScreen"
          component={NewScreen}
          options={{
            title: "Edit Mangi / Bevi",
            gestureEnabled: false,
          }}
        />
        <MealsStack.Screen
          name="ImagesScreen"
          component={ImagesScreen}
          options={({ route }) => ({
            title: route.params.mealTitle,
            headerRight: () => EditMangiIcon(navigation, route.params.mealId),
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

function DevStackContainer() {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <DevStack.Navigator screenOptions={defaultScreenOptions}>
        <DevStack.Screen
          name="DevScreen"
          component={DevScreen}
          options={{ title: "Dev" }}
        />
      </DevStack.Navigator>
    </View>
  );
}

const LoginStack = createNativeStackNavigator();

function LoginStackContainer() {
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

const ProfileStack = createNativeStackNavigator();

function ProfileStackContainer({ navigation }) {
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
        <ProfileStack.Screen
          name="UserProfileScreen"
          component={ProfileScreen}
          options={{
            title: "Your data",
            headerRight: () => LogoutIcon(dispatch, devMode, navigation),
          }}
        />
        <ProfileStack.Screen
          name="UserMealsScreen"
          component={UserMealsScreen}
          options={{ title: "Your Mangis" }}
        />
      </ProfileStack.Navigator>
    </View>
  );
}

const FiltersStack = createNativeStackNavigator();

function FiltersStackContainer() {
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

function NewMealStackContainer() {
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

const MyNavigationContainer = () => {
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = !!token;
  console.log("isAuthenticated " + isAuthenticated);
  const [appIsReady, setAppIsReady] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const tokenData = await LoadToken();

      if (tokenData) {
        dispatch(
          authActions.authenticate(
            tokenData.token,
            tokenData.userId,
            tokenData.expirationTime,
          ),
        );
        return;
      }

      const credentials = await LoadCredentials();

      if (credentials) {
        dispatch(authActions.login(credentials.email, credentials.password));
      }
    };
    async function prepare() {
      try {
        // Keep the splash screen visible while we try login
        await SplashScreen.preventAutoHideAsync();
        await tryLogin();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [dispatch]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated && <LoginStackContainer />}
      {isAuthenticated && <AuthenticatedTabNavigator />}
    </NavigationContainer>
  );
};

export default MyNavigationContainer;
