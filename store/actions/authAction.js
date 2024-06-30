import { HandleResponseError } from "../../common_functions/HandleResponseError";
import {
  ClearToken,
  ResetStorage,
  SaveCredentialsToStorage,
  SaveTokenDataToStorage,
} from "../../common_functions/CredentialStorage";
import { firebaseConfig } from "../../firebase/firebase";
import * as usersActions from "./usersAction";
import User from "../../models/User";
//---------------------------------------------
// Authentication is for the firebase accounts
//---------------------------------------------
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

const FIREBASE_API_KEY = firebaseConfig.apiKey;

export const authenticate = (token, userId, expirationTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expirationTime));
    dispatch({ type: AUTHENTICATE, token: token, userId: userId });
  };
};

export const logout = () => {
  clearLogoutTimer();
  ResetStorage();

  return { type: LOGOUT };
};

export const logoutTimeout = async () => {
  clearLogoutTimer();
  ClearToken();

  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logoutTimeout());
    }, expirationTime);
  };
};

const convertExpirationTimeToMs = (expirationTimeInMinutes) => {
  return parseInt(expirationTimeInMinutes, 10) * 1000;
};

export const signup = (email, password, username) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      },
    );

    await HandleResponseError(response);

    const responseData = await response.json();
    const expirationTimeInMs = convertExpirationTimeToMs(
      responseData.expiresIn,
    );

    dispatch(
      authenticate(
        responseData.idToken,
        responseData.localId,
        expirationTimeInMs,
      ),
    );

    const user = User("error", username, email, [], responseData.localId);
    dispatch(usersActions.createUser(user)).then(() => {
      console.log("logged in as", email);
    });

    const expirationDate = new Date(new Date().getTime() + expirationTimeInMs);
    SaveTokenDataToStorage(
      responseData.idToken,
      responseData.localId,
      expirationDate,
    );
    SaveCredentialsToStorage(email, password);
  };
};

export const resetPass = (email) => {
  //together with redux-thunk, this wrapper is needed
  //even if we technically don't need dispatch
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          requestType: "PASSWORD_RESET",
        }),
      },
    );

    await HandleResponseError(response);

    if (response.ok) {
      console.log("Password reset successful for " + email);
    }

    //reset store and timer here
    logout();
  };
};

export const deleteAccount = () => {
  //together with redux-thunk, this wrapper is needed
  //even if we technically don't need dispatch
  return async (dispatch, getState) => {
    const firebaseId = getState().auth.userId;

    console.log("begin delete account " + firebaseId);

    if (
      firebaseId === "JfrGXVhcsNY78LnqQSie0GTcj692" || //tommy
      firebaseId === "GgseoJjsy8NocDOjWZedK9gDfF53" //kathrin
    ) {
      console.error("Stop deleting your account tommy!");
    } else {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: getState().auth.token,
          }),
        },
      );
      await HandleResponseError(response);
      if (response.ok) {
        console.log("User deleted successful " + firebaseId);
      }
      //reset store and timer here
      logout();
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    console.log("begin login");
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      },
    );

    await HandleResponseError(response);

    const responseData = await response.json();

    const expirationTimeInMs = convertExpirationTimeToMs(
      responseData.expiresIn,
    );
    const token = responseData.idToken;
    const localId = responseData.localId;

    console.log("logged in as", email);

    dispatch(authenticate(token, localId, expirationTimeInMs));

    const expirationDate = new Date(new Date().getTime() + expirationTimeInMs);
    SaveTokenDataToStorage(token, localId, expirationDate);
    SaveCredentialsToStorage(email, password);
  };
};
