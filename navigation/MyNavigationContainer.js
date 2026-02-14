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
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ImagesScreen from "../screens/ImagesScreen";
import AddTagScreen from "../screens/AddTagScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import PasswordResetScreen from "../screens/PasswordResetScreen";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/authAction";
import { LoadCredentials } from "../common_functions/CredentialStorage";
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
import SettingsScreen from "../screens/SettingsScreen";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase/firebase";
import { NAVIGATION_TITLES } from "../constants/NavigationTitles";
import MealDetailScreenNotAuthenticated from "../screens/MealDetailScreenNotAuthenticated";

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: Colors.white,
  headerTitleStyle: {
    fontWeight: "bold",
  },
  //This centers on Android, but makes the text overflow the header-buttons somehow
  // headerTitleAlign: "center",
};

const Tab = createBottomTabNavigator();

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
        tabBarStyle: {
          backgroundColor: Colors.primary,
        },
        tabBarActiveTintColor: Colors.navigationIcon,
        tabBarInactiveTintColor: Colors.second,
        headerShown: false, // Hide all headers in tab screens as they come from stack navigators
      })}>
      <Tab.Screen
        name={NAVIGATION_TITLES.TAB_MEALS}
        component={MealsStackContainer}
      />
      {DEV_MODE && (
        <Tab.Screen
          name={NAVIGATION_TITLES.TAB_DEV}
          component={DevStackContainer}
        />
      )}
      <Tab.Screen
        name={NAVIGATION_TITLES.TAB_FILTERS}
        component={FiltersStackContainer}
      />
      <Tab.Screen
        name={NAVIGATION_TITLES.TAB_USER_PROFILE}
        component={ProfileStackContainer}
      />
      <Tab.Screen
        name={NAVIGATION_TITLES.TAB_NEW_MEAL}
        component={NewMealStackContainer}
      />
    </Tab.Navigator>
  );
}

const MealsStack = createNativeStackNavigator();

const showEditIcon = (mealId, user, users, navigation, currentTab) => {
  const authorId = GetAuthorByMealId(mealId, users).id;
  const authorFriends = GetFriends(authorId, users);
  let show = HasEditPermission(user, authorId, authorFriends);

  if (show) {
    return EditMangiIcon(navigation, mealId, currentTab);
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
        name={NAVIGATION_TITLES.STACK_MEALS}
        component={MealsScreen}
        options={{
          title: "Mangi & Bevi",
        }}
      />
      <MealsStack.Screen
        name={NAVIGATION_TITLES.STACK_MEAL_DETAILS}
        component={MealDetailScreen}
        options={({ route }) => ({
          title: route.params.mealTitle,
          headerRight: () =>
            showEditIcon(
              route.params.mealId,
              user,
              users,
              navigation,
              route.params.currentTabViewed,
            ),
        })}
      />
      <MealsStack.Screen
        name={NAVIGATION_TITLES.STACK_EDIT_MEAL}
        component={NewScreen}
        options={{
          title: "Edit Mangi / Bevi",
          gestureEnabled: false,
        }}
      />
      <MealsStack.Screen
        name={NAVIGATION_TITLES.STACK_IMAGES}
        component={ImagesScreen}
        options={({ route }) => ({
          title: route.params.mealTitle,
          headerRight: () =>
            EditMangiIcon(
              navigation,
              route.params.mealId,
              route.params?.currentTabViewed,
            ),
        })}
      />
      <MealsStack.Screen
        name={NAVIGATION_TITLES.STACK_ADD_TAG}
        component={AddTagScreen}
        options={{ title: "Add Tag" }}
      />
      <MealsStack.Screen
        name={NAVIGATION_TITLES.STACK_EDIT_LINKS}
        component={EditLinksScreen}
        options={{ title: "Add Links" }}
      />
      <MealsStack.Screen
        name={NAVIGATION_TITLES.STACK_SEND_REPORT}
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
        name={NAVIGATION_TITLES.STACK_DEV}
        component={DevScreen}
        options={{ title: "Dev" }}
      />
    </DevStack.Navigator>
  );
}

const FiltersStack = createNativeStackNavigator();

function FiltersStackContainer() {
  return (
    <FiltersStack.Navigator screenOptions={defaultScreenOptions}>
      <FiltersStack.Screen
        name={NAVIGATION_TITLES.STACK_FILTER}
        component={FiltersScreen}
        options={{ title: "Filters" }}
      />
    </FiltersStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileStackContainer() {
  return (
    <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
      <ProfileStack.Screen
        name={NAVIGATION_TITLES.STACK_USER_PROFILE}
        component={ProfileScreen}
        options={{
          title: "Your Data",
          headerRight: () => LogoutIcon(),
        }}
      />
      <ProfileStack.Screen
        name={NAVIGATION_TITLES.STACK_USER_MEALS}
        component={UserMealsScreen}
        options={{ title: "Your Mangis" }}
      />
      <ProfileStack.Screen
        name={NAVIGATION_TITLES.STACK_MANAGE_ACCOUNT}
        component={ManageAccountScreen}
        options={{ title: "Your Account" }}
      />
      <ProfileStack.Screen
        name={NAVIGATION_TITLES.STACK_EDIT_FRIENDS}
        component={EditFriendsScreen}
        options={{ title: "Your Friends" }}
      />
      <ProfileStack.Screen
        name={NAVIGATION_TITLES.STACK_SETTINGS}
        component={SettingsScreen}
        options={{ title: "Your Settings" }}
      />
    </ProfileStack.Navigator>
  );
}

const NewMealStack = createNativeStackNavigator();

function NewMealStackContainer() {
  return (
    <NewMealStack.Navigator screenOptions={defaultScreenOptions}>
      <NewMealStack.Screen
        name={NAVIGATION_TITLES.STACK_NEW}
        component={NewScreen}
        options={{ title: "New Mangi / Bevi" }}
      />
    </NewMealStack.Navigator>
  );
}

const LoginStack = createNativeStackNavigator();

function LoginStackContainer() {
  return (
    <LoginStack.Navigator screenOptions={defaultScreenOptions}>
      <LoginStack.Screen
        name={NAVIGATION_TITLES.LOGGED_OUT_MEALS}
        component={MealsScreenNotAuthenticated}
        options={{
          title: "Mangi & Bevi",
        }}
      />
      <LoginStack.Screen
        name={NAVIGATION_TITLES.LOGGED_OUT_DETAILS}
        component={MealDetailScreenNotAuthenticated}
        options={({ route }) => ({
          title: route.params.mealTitle,
        })}
      />
      <LoginStack.Screen
        name={NAVIGATION_TITLES.LOGGED_OUT_IMAGES}
        component={ImagesScreen}
        options={({ route }) => ({
          title: route.params.mealTitle,
        })}
      />
      <LoginStack.Screen
        name={NAVIGATION_TITLES.LOGIN}
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <LoginStack.Screen
        name={NAVIGATION_TITLES.SIGN_UP}
        component={SignUpScreen}
        options={{ title: "Sign Up" }}
      />
      <LoginStack.Screen
        name={NAVIGATION_TITLES.PASSWORD_RESET}
        component={PasswordResetScreen}
        options={{ title: "Reset Password" }}
      />
    </LoginStack.Navigator>
  );
}

const MyNavigationContainer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log("isAuthenticated in MyNavigationContainer " + isAuthenticated);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        console.log("onAuthStateChanged: User is signed in:", user.uid);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        console.log("onAuthStateChanged: user log out or invalid.");
      }
    });
  }, []);

  const [appIsReady, setAppIsReady] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const credentials = await LoadCredentials();

      if (credentials && credentials.email && credentials.password) {
        await authActions.login(credentials.email, credentials.password);
      } else {
        console.log("Could not load any credentials");
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
