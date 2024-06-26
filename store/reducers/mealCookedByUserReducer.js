import { RemoveDuplicates } from "../../common_functions/RemoveDuplicates";
import {
  SET_MEALS_COOKED_BY_USER,
  ADD_MEAL_COOKED_BY_USER,
} from "../actions/mealCookedByUserAction";

const initialState = {
  mealsCookedByUser: [],
};

const mealCookedByUserReducer = (state = initialState, action) => {
  try {
    switch (action.type) {
      case ADD_MEAL_COOKED_BY_USER:
        const addedMealCookedByUser = [
          ...state.mealsCookedByUser,
          action.mealCookedByUser,
        ];

        return {
          ...state,
          mealsCookedByUser: addedMealCookedByUser,
        };
      case SET_MEALS_COOKED_BY_USER: {
        const arrayWithDuplicates = [
          ...state.mealsCookedByUser,
          ...action.mealCookedByUser,
        ];

        const newMealsCookedByUser = RemoveDuplicates(arrayWithDuplicates);

        return {
          ...state,
          mealsCookedByUser: newMealsCookedByUser,
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
