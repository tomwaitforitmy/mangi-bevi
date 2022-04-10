import { HandleResponseError } from "../../common_functions/HandleResponseError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ClearToken,
  CREDENTIALS,
  ResetStorage,
  SaveCredentialsToStorage,
  SaveTokenDataToStorage,
  TOKEN,
} from "../../common_functions/TryLogin";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

const FIREBASE_API_KEY = "AIzaSyBK-NbCaWKt412ZW0uBZP5N87RQHck8KwA";

export const authenticate = (token, userId, experiationTime) => {
  return (dispach) => {
    dispach(setLogoutTimer(experiationTime));
    dispach({ type: AUTHENTICATE, token: token, userId: userId });
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

const setLogoutTimer = (experiationTime) => {
  return (dispach) => {
    timer = setTimeout(() => {
      dispach(logoutTimeout());
    }, experiationTime);
  };
};

const convertExpirationTimeToMs = (experiationTimeInMinutes) => {
  return parseInt(experiationTimeInMinutes) * 1000;
};

export const signup = (email, password) => {
  return async (dispach) => {
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
      }
    );

    await HandleResponseError(response);

    const responseData = await response.json();
    const experiationTimeInMs = convertExpirationTimeToMs(
      responseData.expiresIn
    );

    dispach(
      authenticate(
        responseData.idToken,
        responseData.localId,
        experiationTimeInMs
      )
    );

    const expericationDate = new Date(
      new Date().getTime() + experiationTimeInMs
    );
    SaveTokenDataToStorage(
      responseData.idToken,
      responseData.localId,
      expericationDate
    );
    SaveCredentialsToStorage(email, password);
  };
};

export const login = (email, password) => {
  return async (dispach) => {
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
      }
    );

    await HandleResponseError(response);

    const responseData = await response.json();

    const experiationTimeInMs = convertExpirationTimeToMs(
      responseData.expiresIn
    );

    dispach(
      authenticate(
        responseData.idToken,
        responseData.localId,
        experiationTimeInMs
      )
    );

    const expericationDate = new Date(
      new Date().getTime() + experiationTimeInMs
    );
    SaveTokenDataToStorage(
      responseData.idToken,
      responseData.localId,
      expericationDate
    );
    SaveCredentialsToStorage(email, password);
  };
};
