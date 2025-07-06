import { RemoveDuplicates } from "../../common_functions/RemoveDuplicates";
import {
  SET_MEALS_COOKED_BY_USER,
  ADD_MEAL_COOKED_BY_USER,
  SET_MEAL_COOKED_BY_USER,
} from "../actions/mealCookedByUserAction";

const initialState = {
  mealCookedByUser: [], //this for a single MealDetailScreen. Is loaded via fetchCookedByUsers
  mealsCookedByUser: [], //this is for all meals in MealsScreen/SelectSortingModal. Is loaded via fetchMealsCookedByUsers
};

const mealCookedByUserReducer = (state = initialState, action) => {
  try {
    switch (action.type) {
      case ADD_MEAL_COOKED_BY_USER:
        const addedMealCookedByUser = [
          ...state.mealCookedByUser,
          action.mealCookedByUser,
        ];

        return {
          ...state,
          mealCookedByUser: addedMealCookedByUser,
        };
      case SET_MEAL_COOKED_BY_USER: {
        const arrayWithDuplicates = [
          ...state.mealCookedByUser,
          ...action.mealCookedByUser,
        ];

        const newMealCookedByUser = RemoveDuplicates(arrayWithDuplicates);

        return {
          ...state,
          mealCookedByUser: newMealCookedByUser,
        };
      }
      case SET_MEALS_COOKED_BY_USER: {
        return {
          ...state,
          mealsCookedByUser: action.mealsCookedByUser,
        };
      }
      default:
        return state;
    }
  } catch (error) {
    console.error(error);
  }
};

export default mealCookedByUserReducer;
