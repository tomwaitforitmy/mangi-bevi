import { HandleResponseError } from "../../common_functions/HandleResponseError";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  AsyncStorage.removeItem("userData");
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
      dispach(logout());
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
    saveDataToStorage(
      responseData.idToken,
      responseData.localId,
      expericationDate
    );
  };
};

export const login = (email, password) => {
  console.log("begin login");
  email = "tommy@test.com";
  password = "123456";
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
    saveDataToStorage(
      responseData.idToken,
      responseData.localId,
      expericationDate
    );
  };
};

const saveDataToStorage = (token, userId, expericationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expericationDate: expericationDate.toISOString(),
    })
  );
};
