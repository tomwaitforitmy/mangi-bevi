import "react-native-gesture-handler";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45.",
]); //Ignore a warning from my third parties

import MyNavigationContainer from "./navigation/MyNavigationContainer";
import ReduxThunk from "redux-thunk";

// Redux Store
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import mealsReducer from "./store/reducers/mealsReducer";
import authReducer from "./store/reducers/authReducer";
import tagsReducer from "./store/reducers/tagsReducer";
import usersReducer from "./store/reducers/usersReducer";
import searchReducer from "./store/reducers/searchReducer";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

const rootReducer = combineReducers({
  meals: mealsReducer,
  auth: authReducer,
  tags: tagsReducer,
  users: usersReducer,
  search: searchReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

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
