import { HandleResponseError } from "../../common_functions/HandleResponseError";
import {
  LoadCredentials,
  ResetStorage,
  SaveCredentialsToStorage,
} from "../../common_functions/CredentialStorage";
import { firebaseConfig } from "../../firebase/firebase";
import * as usersActions from "./usersAction";
import User from "../../models/User";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

//---------------------------------------------
// Authentication is for the firebase accounts
//---------------------------------------------
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
const auth = getAuth();

let intervalTimer;

const FIREBASE_API_KEY = firebaseConfig.apiKey;

export const authenticate = (token, userId) => {
  return (dispatch) => {
    intervalTimer = setInterval(checkAndRefresh, 30 * 60 * 1000);
    dispatch({ type: AUTHENTICATE, token: token, userId: userId });
  };
};

export const logout = () => {
  return async (dispatch) => {
    await signOut(auth);
    clearLogoutInterval();
    ResetStorage();

    dispatch({ type: LOGOUT });
  };
};

const clearLogoutInterval = () => {
  if (intervalTimer) {
    clearInterval(intervalTimer);
  }
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

    dispatch(authenticate(responseData.idToken, responseData.localId));

    const user = User("error", username, email, [], responseData.localId);
    dispatch(usersActions.createUser(user)).then(() => {
      console.log("logged in as", email);
    });

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

    const credentials = await refreshLogin(email, password, dispatch);

    dispatch(authenticate(credentials.token, credentials.localId));

    SaveCredentialsToStorage(email, password);
  };
};

const refreshLogin = async (email, password) => {
  //## SDK login
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const token = await auth.currentUser.getIdToken();
  const localId = await auth.currentUser.uid;

  console.log("refreshed/logged in as", email);
  return { token, localId };
};

const checkAndRefresh = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return; // No user logged in
  }

  console.log("Force refresh token");

  const credentials = await LoadCredentials();

  await refreshLogin(credentials.email, credentials.password);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.uid);
  } else {
    console.log(
      "onAuthStateChanged: user log out or token invalid. Make sure to invalidate state.",
    );
  }
});
