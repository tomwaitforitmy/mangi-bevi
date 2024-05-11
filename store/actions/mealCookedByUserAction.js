import { HandleResponseError } from "../../common_functions/HandleResponseError";
import MealCookedByUser from "../../models/MealCookedByUser";

export const ADD_MEAL_COOKED_BY_USER = "ADD_MEAL_COOKED_BY_USER";
export const SET_MEALS_COOKED_BY_USER = "SET_MEALS_COOKED_BY_USER";

const replacer = (key, value) => {
  if (key === "id") {
    return undefined;
  } else {
    return value;
  }
};

export const addMealCookedByUser = (mealCookedByUser) => {
  return async (dispatch, getState) => {
    console.log("Begin addMealCookedByUser");
    try {
      const token = getState().auth.token;
      if (!token) {
        console.log("No token found! Request will fail! Reload App tommy");
      }
      const response = await fetch(
        `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/mealCookedByUser.json?auth=${token}`,
        {
          method: "POST",
          header: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(mealCookedByUser, replacer),
        },
      );

      await HandleResponseError(response);

      const responseData = await response.json();

      mealCookedByUser = { ...mealCookedByUser, id: responseData.name };

      console.log("End addMealCookedByUser");

      dispatch({
        type: ADD_MEAL_COOKED_BY_USER,
        mealCookedByUser: mealCookedByUser,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};

export const fetchCookedByUsers = (mealId) => {
  return async (dispatch, getState) => {
    console.log("Begin fetchCookedByUsers");
    try {
      const token = getState().auth.token;

      const response = await fetch(
        `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/mealCookedByUser.json?mealId=${mealId}&auth=${token}`,
      );

      await HandleResponseError(response);

      const responseData = await response.json();

      const loadedCookedByUsers = [];

      for (const key in responseData) {
        loadedCookedByUsers.push(
          MealCookedByUser(
            key,
            responseData[key].mealId,
            responseData[key].userId,
            responseData[key].date
              ? new Date(responseData[key].date).toISOString()
              : "error",
          ),
        );
      }

      console.log("End fetchCookedByUsers");

      dispatch({
        type: SET_MEALS_COOKED_BY_USER,
        mealCookedByUser: loadedCookedByUsers,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};
