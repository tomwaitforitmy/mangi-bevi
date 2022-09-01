import React from "react";
import { render, screen } from "@testing-library/react-native";
import AuthenticationContent from "../../components/AuthenticationContent";

// Redux Store
import ReduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import authReducer from "../../store/reducers/authReducer";
import usersReducer from "../../store/reducers/usersReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

describe("AuthenticationContent", () => {
  it("renders error message for wrong user", () => {
    const navigation = jest.fn();
    render(
      <Provider store={store}>
        <AuthenticationContent navigation={navigation} login={true} />
      </Provider>,
    );

    expect(screen.queryByText("Login")).toBeTruthy();
  });
});
