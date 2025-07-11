import { HandleResponseError } from "../../common_functions/HandleResponseError";
import { firebaseAuth } from "../../firebase/firebase";
import { getUsersUrl, getUserUrl } from "../../firebase/urls";
import User from "../../models/User";
import * as authAction from "./authAction";

//---------------------------------------------
// user action is for my user data such as name
//---------------------------------------------

export const CREATE_USER = "CREATE_USER";
export const EDIT_USER = "EDIT_USER";
export const EDIT_FRIENDS = "EDIT_FRIENDS";
export const EDIT_EXPO_PUSH_TOKEN = "EDIT_EXPO_PUSH_TOKEN";
export const EDIT_SETTINGS = "EDIT_SETTINGS";
export const SET_USERS = "SET_USERS";
export const UPDATE_USER_STATS = "UPDATE_USER_STATS";
export const ERROR_NO_USER_LOGGED_IN = "ERROR_NO_USER_LOGGED_IN";

export const fetchUsers = () => {
  return async (dispatch) => {
    console.log("Begin fetch Users");
    try {
      const token = await authAction.getToken();
      const response = await fetch(getUsersUrl(token));

      await HandleResponseError(response);

      const responseData = await response.json();
      const loadedUsers = [];

      for (const key in responseData) {
        loadedUsers.push(
          User(
            key,
            responseData[key].name,
            responseData[key].email,
            responseData[key].meals ? responseData[key].meals : [],
            responseData[key].firebaseId,
            responseData[key].friends ? responseData[key].friends : [],
            responseData[key].expoPushToken
              ? responseData[key].expoPushToken
              : "no token",
            responseData[key].settings ? responseData[key].settings : [],
          ),
        );
      }

      let user = ERROR_NO_USER_LOGGED_IN;
      if (firebaseAuth.currentUser) {
        const firebaseId = firebaseAuth.currentUser.uid;
        user = loadedUsers.find((u) => u.firebaseId === firebaseId);
      }

      dispatch({
        type: SET_USERS,
        users: loadedUsers,
        user: user,
      });
    } catch (error) {
      throw error;
    }
    console.log("End fetch Users");
  };
};

const replacer = (key, value) => {
  if (key === "id") {
    return undefined;
  } else {
    return value;
  }
};

export const signUpAndCreateUser = (email, password, username) => {
  return async (dispatch) => {
    console.log("begin signUpAndCreateUser");
    const user = await authAction.signup(email, password, username);

    await dispatch(createUser(user)).then(() => {
      console.log("end signed up as", user.email);
    });
  };
};

export const createUser = (user) => {
  return async (dispatch) => {
    console.log("Begin create User");
    const token = await authAction.getToken();
    const response = await fetch(getUsersUrl(token), {
      method: "POST",
      header: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user, replacer),
    });

    await HandleResponseError(response);

    const responseData = await response.json();

    user = { ...user, id: responseData.name };

    console.log("End create User");

    dispatch({ type: CREATE_USER, user: user });

    return responseData.name;
  };
};

export const editUser = (user) => {
  return async (dispatch, getState) => {
    console.log("begin edit user");
    const token = await authAction.getToken();
    const response = await fetch(getUserUrl(user.id, token), {
      method: "PATCH",
      header: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user, replacer),
    });

    await HandleResponseError(response);
    if (response.ok) {
      console.log("Successfully edited user");
    }

    //Meals are needed to update stats and user meals data.
    const meals = getState().meals.meals;

    dispatch({ type: EDIT_USER, user: user, meals: meals });
    console.log("end edit user");
  };
};

export const editFriends = (user) => {
  return async (dispatch) => {
    console.log("begin edit friends");
    const token = await authAction.getToken();
    const response = await fetch(getUserUrl(user.id, token), {
      method: "PATCH",
      header: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        friends: user.friends,
      }),
    });

    await HandleResponseError(response);

    console.log("end edit friends");

    dispatch({ type: EDIT_FRIENDS, user: user });
  };
};

export const editExpoPushToken = (user) => {
  return async (dispatch) => {
    console.log("begin edit expoPushToken");
    const token = await authAction.getToken();
    const response = await fetch(getUserUrl(user.id, token), {
      method: "PATCH",
      header: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        expoPushToken: user.expoPushToken,
      }),
    });

    await HandleResponseError(response);

    console.log("end edit expoPushToken");

    dispatch({ type: EDIT_EXPO_PUSH_TOKEN, user: user });
  };
};

export const editSettings = (user) => {
  return async (dispatch) => {
    console.log("begin edit settings");
    const token = await authAction.getToken();
    const response = await fetch(getUserUrl(user.id, token), {
      method: "PATCH",
      header: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        settings: user.settings,
      }),
    });

    await HandleResponseError(response);

    console.log("end edit settings");

    dispatch({ type: EDIT_SETTINGS, user: user });
  };
};

export const deleteUser = (user) => {
  return async (dispatch) => {
    console.log("begin delete user");
    if (user.email === "tomwaitforitmy@gmail.com") {
      console.error("Stop deleting yourself tommy!");
    } else {
      const token = await authAction.getToken();
      const response = await fetch(getUserUrl(user.id, token), {
        method: "DELETE",
      });
      await HandleResponseError(response);
      if (response.ok) {
        console.log("Successfully delete user " + user);
      }
    }

    console.log("end delete user");
  };
};
