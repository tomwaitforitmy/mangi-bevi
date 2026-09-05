import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch } from "react-redux";
import mealsReducer from "../store/reducers/mealsReducer";
import tagsReducer from "../store/reducers/tagsReducer";
import usersReducer from "../store/reducers/usersReducer";
import searchReducer from "../store/reducers/searchReducer";
import mealCookedByUserReducer from "../store/reducers/mealCookedByUserReducer";
import featuresReducer from "../store/reducers/featuresReducer";
import uiReducer from "../store/reducers/uiReducer";
import * as authActions from "../store/actions/authAction";
import { LoadCredentials } from "../common_functions/CredentialStorage";
import { useAuthState } from "../common_functions/useAuthState";
import { DEBUG_MODE } from "../data/Environment";
import ThemeProvider from "../theme/ThemeProvider";

LogBox.ignoreLogs([
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45.",
  // eslint-disable-next-line quotes
  'A props object containing a "key" prop is being spread into JSX',
  "expo-notifications: Android Push notifications",
  "`expo-notifications` functionality is not fully supported in Expo Go",
]); //Ignore a warning from my third parties

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

const store = configureStore({
  reducer: {
    meals: mealsReducer,
    tags: tagsReducer,
    users: usersReducer,
    search: searchReducer,
    mealsCookedByUser: mealCookedByUserReducer,
    features: featuresReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 200 },
      serializableCheck: { warnAfter: 200 },
      //These checks are disabled in production anyway.
      //However, they cause warnings like this if I work with all data:
      //"ImmutableStateInvariantMiddleware took 56ms, which is more than the warning threshold of 32ms."
      //Therefore, I increased the threshold.
    }),
});

function RootNavigator() {
  const isAuthenticated = useAuthState();
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

  if (DEBUG_MODE) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="debug" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Screen name="meal/[mealId]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
