import "react-native-gesture-handler"; //fixes a crash at app on iOS -> Needed for StackNavigator? See: https://developer.apple.com/forums/thread/722633
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealsScreen from "../screens/MealsScreen";
import MealsScreenNotAuthenticated from "../screens/MealsScreenNotAuthenticated";
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
import PasswordResetScreen from "../screens/PasswordResetScreen";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/authAction";
import {
  LoadCredentials,
  LoadToken,
} from "../common_functions/CredentialStorage";
import * as SplashScreen from "expo-splash-screen";
import { Platform } from "react-native";
import ProfileScreen from "../screens/ProfileScreen";
import UserMealsScreen from "../screens/UserMealsScreen";
import LogoutIcon from "../components/HeaderIcons/LogoutIcon";
import EditMangiIcon from "../components/HeaderIcons/EditMangiIcon";
import TabBarIcon from "../components/HeaderIcons/TabBarIcon";
import EditLinksScreen from "../screens/EditLinksScreen";
import { DEV_MODE } from "../data/Environment";
import ManageAccountScreen from "../screens/ManageAccountScreen";
import EditFriendsScreen from "../screens/EditFriendsScreen";
import { GetAuthorByMealId } from "../common_functions/GetAuthorName";
import { HasEditPermission } from "../common_functions/HasEditPermission";
import { GetFriends } from "../common_functions/GetFriends";
import SendReportScreen from "../screens/SendReportScreen";

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: Colors.white,
  headerTitleStyle: {
    fontWeight: "bold",
  },
  headerTitleAlign: "center",
};

const Tab = createMaterialBottomTabNavigator();

function AuthenticatedTabNavigator() {
  return (
    <Tab.Navigator
      activeColor={Colors.navigationIcon}
      inactiveColor={Colors.second}
      //it was mentioned on github, that this should be false on iOS
      //and true on android to make keyboardAvoidingView work with material-bottom-tabs
      keyboardHidesNavigationBar={Platform.OS === "ios" ? false : true}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) =>
          TabBarIcon(focused, color, route.name),
        tabBarColor: Colors.primary,
      })}>
      <Tab.Screen name="Mangi & Bevi" component={MealsStackContainer} />
      {DEV_MODE && <Tab.Screen name="Dev" component={DevStackContainer} />}
      <Tab.Screen name="Filters" component={FiltersStackContainer} />
      <Tab.Screen name="Profile" component={ProfileStackContainer} />
      <Tab.Screen name="New" component={NewMealStackContainer} />
    </Tab.Navigator>
  );
}

const MealsStack = createNativeStackNavigator();

const showEditIcon = (
  mealId,
  user,
  users,
  navigation,
  selectedTabEdit,
  updateRenderCounter,
) => {
  const authorId = GetAuthorByMealId(mealId, users).id;
  const authorFriends = GetFriends(authorId, users);
  let show = HasEditPermission(user, authorId, authorFriends);

  if (show) {
    return EditMangiIcon(
      navigation,
      mealId,
      selectedTabEdit,
      updateRenderCounter,
    );
  } else {
    return <></>;
  }
};

function MealsStackContainer({ navigation }) {
  const users = useSelector((state) => state.users.users);
  const user = useSelector((state) => state.users.user);

  return (
    <MealsStack.Navigator screenOptions={defaultScreenOptions}>
      <MealsStack.Screen
        name="Meals"
        component={MealsScreen}
        options={{
          title: "Mangi & Bevi",
        }}
      />
      <MealsStack.Screen
        name="Details"
        component={MealDetailScreen}
        options={({ route }) => ({
          title: route.params.mealTitle,
          headerRight: () =>
            showEditIcon(
              route.params.mealId,
              user,
              users,
              navigation,
              route.params.selectedTabEdit,
              route.params.updateRenderCounter,
            ),
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
      <MealsStack.Screen
        name="EditLinksScreen"
        component={EditLinksScreen}
        options={{ title: "Add Links" }}
      />
      <MealsStack.Screen
        name="SendReportScreen"
        component={SendReportScreen}
        options={{ title: "Report" }}
      />
    </MealsStack.Navigator>
  );
}

const DevStack = createNativeStackNavigator();

function DevStackContainer() {
  return (
    <DevStack.Navigator screenOptions={defaultScreenOptions}>
      <DevStack.Screen
        name="DevScreen"
        component={DevScreen}
        options={{ title: "Dev" }}
      />
    </DevStack.Navigator>
  );
}

const LoginStack = createNativeStackNavigator();

function LoginStackContainer() {
  return (
    <LoginStack.Navigator screenOptions={defaultScreenOptions}>
      <MealsStack.Screen
        name="Meals"
        component={MealsScreenNotAuthenticated}
        options={{
          title: "Mangi & Bevi",
        }}
      />
      <MealsStack.Screen
        name="Details"
        component={MealDetailScreen}
        options={({ route }) => ({
          title: route.params.mealTitle,
        })}
      />
      <MealsStack.Screen
        name="ImagesScreen"
        component={ImagesScreen}
        options={({ route }) => ({
          title: route.params.mealTitle,
        })}
      />
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
      <LoginStack.Screen
        name="PasswordResetScreen"
        component={PasswordResetScreen}
        options={{ title: "Reset Password" }}
      />
    </LoginStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileStackContainer({ navigation }) {
  const dispatch = useDispatch();

  return (
    <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
      <ProfileStack.Screen
        name="UserProfileScreen"
        component={ProfileScreen}
        options={{
          title: "Your Data",
          headerRight: () => LogoutIcon(dispatch, DEV_MODE, navigation),
        }}
      />
      <ProfileStack.Screen
        name="UserMealsScreen"
        component={UserMealsScreen}
        options={{ title: "Your Mangis" }}
      />
      <ProfileStack.Screen
        name="ManageAccountScreen"
        component={ManageAccountScreen}
        options={{ title: "Your Account" }}
      />
      <ProfileStack.Screen
        name="EditFriendsScreen"
        component={EditFriendsScreen}
        options={{ title: "Your Friends" }}
      />
    </ProfileStack.Navigator>
  );
}

const FiltersStack = createNativeStackNavigator();

function FiltersStackContainer() {
  return (
    <FiltersStack.Navigator screenOptions={defaultScreenOptions}>
      <FiltersStack.Screen
        name="FiltersScreen"
        component={FiltersScreen}
        options={{ title: "Filters" }}
      />
    </FiltersStack.Navigator>
  );
}

const NewMealStack = createNativeStackNavigator();

function NewMealStackContainer() {
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
