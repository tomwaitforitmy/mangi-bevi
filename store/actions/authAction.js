import { HandleResponseError } from "../../common_functions/HandleResponseError";
import {
  ResetStorage,
  SaveCredentialsToStorage,
} from "../../common_functions/CredentialStorage";
import { firebaseAuth, firebaseConfig } from "../../firebase/firebase";
import User from "../../models/User";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

//---------------------------------------------
// Authentication is for the firebase accounts
//---------------------------------------------
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

const FIREBASE_API_KEY = firebaseConfig.apiKey;

export const getToken = async () => {
  try {
    const token = await firebaseAuth.currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error(
      "Could not get firebase token! User:" + firebaseAuth.currentUser,
    );
    throw error;
  }
};

export const authenticate = (token, userId) => {
  return (dispatch) => {
    dispatch({ type: AUTHENTICATE, token: token, userId: userId });
  };
};

export const logout = () => {
  return async (dispatch) => {
    await signOut(firebaseAuth);
    ResetStorage();

    dispatch({ type: LOGOUT });
  };
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

    await dispatch(authenticate(responseData.idToken, responseData.localId));

    SaveCredentialsToStorage(email, password);

    const user = User("error", username, email, [], responseData.localId);

    return user;
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
  return async (dispatch) => {
    const firebaseId = firebaseAuth.currentUser.uid;
    const token = await getToken();

    console.log("begin delete account " + firebaseId);

    if (firebaseId === "JfrGXVhcsNY78LnqQSie0GTcj692") {
      console.error("Stop deleting your account tommy!");
    } else {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: token,
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

    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );

      const token = await getToken();
      const localId = firebaseAuth.currentUser.uid;

      console.log("logged in as", email);

      await dispatch(authenticate(token, localId));

      SaveCredentialsToStorage(email, password);
    } catch (error) {
      console.error(error);
    }
  };
};
