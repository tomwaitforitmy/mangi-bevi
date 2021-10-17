import { HandleResponseError } from "../../common_functions/HandleResponseError";
import Meal from "../../models/Meal";

export const DELETE_MEAL = "DELETE_MEAL";
export const CREATE_MEAL = "CREATE_MEAL";
export const EDIT_MEAL = "EDIT_MEAL";
export const SET_MEALS = "SET_MEALS";

export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";
export const SET_FILTERS = "SET_FILTERS";

export const toggleFavorite = (id) => {
  return { type: TOGGLE_FAVORITE, mealId: id };
};

export const setFilters = (filtersSettings) => {
  return { type: SET_FILTERS, filters: filtersSettings };
};

export const fetchMeals = () => {
  return async (dispatch, getState) => {
    console.log("Begin fetchMeals");
    try {
      const response = await fetch(
        "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals.json"
      );

      await HandleResponseError(response);

      const responseData = await response.json();
      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push(
          new Meal(
            responseData[key].title,
            key,
            responseData[key].imageUrl,
            responseData[key].ingredients,
            responseData[key].steps
          )
        );
      }

      dispatch({
        type: SET_MEALS,
        meals: loadedMeals,
      });
    } catch (error) {
      throw error;
    }
  };
};

const replacer = (key, value) => {
  if (key === "id") return undefined;
  else return value;
};

export const createMeal = (meal) => {
  return async (dispatch, getState) => {
    console.log("Begin createMeal");
    const token = getState().auth.token;
    console.log(token);

    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals.json?auth=${token}`,
      {
        method: "POST",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(meal, replacer),
      }
    );

    await HandleResponseError(response);

    const responseData = await response.json();

    meal = { ...meal, id: responseData.name };

    dispatch({ type: CREATE_MEAL, meal: meal });
  };
};
