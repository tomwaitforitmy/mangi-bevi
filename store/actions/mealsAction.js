import { HandleResponseError } from "../../common_functions/HandleResponseError";
import Meal from "../../models/Meal";

export const DELETE_MEAL = "DELETE_MEAL";
export const CREATE_MEAL = "ADD_MEAL";
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
