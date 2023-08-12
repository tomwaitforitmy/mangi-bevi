import { HandleResponseError } from "../../common_functions/HandleResponseError";
import User from "../../models/User";

//---------------------------------------------
// user action is for my user data such as name
//---------------------------------------------

export const CREATE_USER = "CREATE_USER";
export const EDIT_USER = "EDIT_USER";
export const EDIT_FRIENDS = "EDIT_FRIENDS";
export const SET_USERS = "SET_USERS";
export const UPDATE_USER_STATS = "UPDATE_USER_STATS";

export const fetchUsers = () => {
  return async (dispatch, getState) => {
    console.log("Begin fetch Users");
    try {
      const response = await fetch(
        "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/users.json",
      );

      await HandleResponseError(response);

      const responseData = await response.json();
      const loadedUsers = [];

      for (const key in responseData) {
        loadedUsers.push(
          new User(
            key,
            responseData[key].name,
            responseData[key].email,
            responseData[key].meals ? responseData[key].meals : [],
            responseData[key].firebaseId,
            responseData[key].friends ? responseData[key].friends : [],
          ),
        );
      }

      const firebaseId = getState().auth.userId;
      const user = loadedUsers.find((u) => u.firebaseId === firebaseId);

      dispatch({
        type: SET_USERS,
        users: loadedUsers,
        user: user,
      });
    } catch (error) {
      throw error;
    }
  };
};

const replacer = (key, value) => {
  if (key === "id") {
    return undefined;
  } else {
    return value;
  }
};

export const createUser = (user) => {
  return async (dispatch, getState) => {
    console.log("Begin create User");
    const token = getState().auth.token;
    user.firebaseId = getState().auth.userId;

    if (!token) {
      console.log("No token found! Request will fail! Reload App tommy");
    }

    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`,
      {
        method: "POST",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user, replacer),
      },
    );

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
    const token = getState().auth.token;
    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/users/${user.id}.json?auth=${token}`,
      {
        method: "PATCH",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user, replacer),
      },
    );

    await HandleResponseError(response);

    console.log("end edit user");

    //Meals are needed to update stats and user meals data.
    const meals = getState().meals.meals;

    dispatch({ type: EDIT_USER, user: user, meals: meals });
  };
};

export const editFriends = (user) => {
  return async (dispatch, getState) => {
    console.log("begin edit friends");
    const token = getState().auth.token;
    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/users/${user.id}.json?auth=${token}`,
      {
        method: "PATCH",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          friends: user.friends,
        }),
      },
    );

    await HandleResponseError(response);

    console.log("end edit friends");

    dispatch({ type: EDIT_FRIENDS, user: user });
  };
};

export const deleteUser = (user) => {
  return async (dispatch, getState) => {
    console.log("begin delete user");
    if (
      user.email === "tomwaitforitmy@gmail.com" ||
      user.email === "kathi_j@gmx.de"
    ) {
      console.error("Stop deleting yourself tommy!");
    } else {
      const token = getState().auth.token;
      const response = await fetch(
        `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/users/${user.id}.json?auth=${token}`,
        {
          method: "DELETE",
        },
      );
      await HandleResponseError(response);
      if (response.ok) {
        console.log("Successfully delete user " + user);
      }
    }

    console.log("end delete user");
  };
};
