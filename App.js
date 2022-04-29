import "react-native-gesture-handler";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MyNavigationContainer from "./navigation/MyNavigationContainer";
import ReduxThunk from "redux-thunk";

// Redux Store
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import mealsReducer from "./store/reducers/mealsReducer";
import authReducer from "./store/reducers/authReducer";
import tagsReducer from "./store/reducers/tagsReducer";

const rootReducer = combineReducers({
  meals: mealsReducer,
  auth: authReducer,
  tags: tagsReducer,
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
