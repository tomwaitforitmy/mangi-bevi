import { HandleResponseError } from "../../common_functions/HandleResponseError";
import Meal from "../../models/Meal";
import { UPDATE_USER_STATS } from "./usersAction";

export const DELETE_MEAL = "DELETE_MEAL";
export const CREATE_MEAL = "CREATE_MEAL";
export const EDIT_MEAL = "EDIT_MEAL";
export const SET_MEALS = "SET_MEALS";

export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";

export const toggleFavorite = (id) => {
  return { type: TOGGLE_FAVORITE, mealId: id };
};

export const fetchMeals = () => {
  return async (dispatch) => {
    console.log("Begin fetchMeals");
    try {
      const response = await fetch(
        "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals.json",
      );

      await HandleResponseError(response);

      const responseData = await response.json();
      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push(
          new Meal(
            responseData[key].title,
            key,
            responseData[key].primaryImageUrl,
            responseData[key].ingredients,
            responseData[key].steps,
            responseData[key].imageUrls ? responseData[key].imageUrls : [],
            responseData[key].tags ? responseData[key].tags : [],
            responseData[key].rating ? responseData[key].rating : 0,
            responseData[key].authorId ? responseData[key].authorId : "error",
            responseData[key].creationDate
              ? new Date(responseData[key].creationDate)
              : "error",
            responseData[key].editorId ? responseData[key].editorId : "error",
            responseData[key].editDate
              ? new Date(responseData[key].editDate)
              : "error",
            responseData[key].links ? responseData[key].links : [],
          ),
        );
      }

      //Invert order to show newest
      loadedMeals.reverse();

      dispatch({
        type: SET_MEALS,
        meals: loadedMeals,
      });
      //Update the statistics and the user meals data.
      //This is possible the first time after we received all meals.
      dispatch({
        type: UPDATE_USER_STATS,
        meals: loadedMeals,
      });
    } catch (error) {
      throw error;
    }
  };
};

const replacer = (key, value) => {
  if (key === "id") {
    return undefined;
    //do not upload this to firebase
  } else if (key === "isSelected") {
    return undefined;
  } else {
    return value;
  }
};

export const createMeal = (meal) => {
  return async (dispatch, getState) => {
    console.log("Begin createMeal");
    const token = getState().auth.token;
    if (!token) {
      console.log("No token found! Request will fail! Reload App tommy");
    }

    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals.json?auth=${token}`,
      {
        method: "POST",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(meal, replacer),
      },
    );

    await HandleResponseError(response);

    const responseData = await response.json();

    meal = { ...meal, id: responseData.name };

    console.log("End createMeal");

    dispatch({ type: CREATE_MEAL, meal: meal });

    return responseData.name;
  };
};

export const editMeal = (meal) => {
  return async (dispatch, getState) => {
    console.log("begin edit meal");
    const token = getState().auth.token;
    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals/${meal.id}.json?auth=${token}`,
      {
        method: "PATCH",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(meal, replacer),
      },
    );

    await HandleResponseError(response);

    console.log("end edit meal");

    dispatch({ type: EDIT_MEAL, meal: meal });
  };
};
