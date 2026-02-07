import "react-native-gesture-handler";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45.",
  // eslint-disable-next-line quotes
  'A props object containing a "key" prop is being spread into JSX',
  "expo-notifications: Android Push notifications",
  "`expo-notifications` functionality is not fully supported in Expo Go",
]); //Ignore a warning from my third parties

import MyNavigationContainer from "./navigation/MyNavigationContainer";

// Redux Store
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import mealsReducer from "./store/reducers/mealsReducer";
import tagsReducer from "./store/reducers/tagsReducer";
import usersReducer from "./store/reducers/usersReducer";
import searchReducer from "./store/reducers/searchReducer";
import mealCookedByUserReducer from "./store/reducers/mealCookedByUserReducer";
import * as Notifications from "expo-notifications";
import featuresReducer from "./store/reducers/featuresReducer";
import uiReducer from "./store/slices/uiSlice";

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
      // immutableCheck: false,
      // serializableCheck: false,
      //These checks are disabled in production anyway.
      //However, they cause warnings like this if I work with all data:
      //"ImmutableStateInvariantMiddleware took 56ms, which is more than the warning threshold of 32ms."
      //Therefore, I increased the threshold.
      //Use this to fine tune ignore filters in case of too much errors:
      // serializableCheck: {
      //   // Ignore these paths in the state
      //   ignoredPaths: ["user", "users"],
      //   // Ignore these paths in actions
      //   ignoredActionPaths: ["user", "users"],
      // },
      //state: actual redux store
      //action: inside a reducer before changing state
    }),
});

function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MyNavigationContainer />
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
