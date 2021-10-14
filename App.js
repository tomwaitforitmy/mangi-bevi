// In App.js in a new project

import * as React from "react";
import MyNavigationContainer from "./navigation/MyNavigationContainer";

// Redux Store
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import mealsReducer from "./store/reducers/mealsReducer";

const rootReducer = combineReducers({ meals: mealsReducer });

const store = createStore(rootReducer);

function App() {
  return (
    <Provider store={store}>
      <MyNavigationContainer />
    </Provider>
  );
}

export default App;
