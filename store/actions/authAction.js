import { HandleResponseError } from "../../common_functions/HandleResponseError";
import {
  ClearToken,
  ResetStorage,
  SaveCredentialsToStorage,
  SaveTokenDataToStorage,
} from "../../common_functions/CredentialStorage";
import * as usersActions from "./usersAction";
import User from "../../models/User";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

const FIREBASE_API_KEY = "AIzaSyBK-NbCaWKt412ZW0uBZP5N87RQHck8KwA";

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

export const logoutTimeout = () => {
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

export const signup = (email, password) => {
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

    const user = new User("error", email, email, [], responseData.localId);
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

export const login = (email, password) => {
  return async (dispatch) => {
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

    dispatch(
      authenticate(
        responseData.idToken,
        responseData.localId,
        expirationTimeInMs,
      ),
    );

    dispatch(usersActions.fetchUsers()).then(() => {
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
