import { MEALS } from "../../data/DummyMeals";
import {
  TOGGLE_FAVORITE,
  SET_MEALS,
  CREATE_MEAL,
  EDIT_MEAL,
} from "../actions/mealsAction";

const initialState = {
  meals: MEALS,
  filteredMeals: MEALS,
  favoriteMeals: [],
};

const mealsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MEALS: {
      return {
        ...state,
        meals: action.meals,
      };
    }
    case TOGGLE_FAVORITE: {
      const existingIndex = state.favoriteMeals.findIndex(
        (meal) => meal.id === action.mealId,
      );
      if (existingIndex >= 0) {
        const updatedFavMeals = [...state.favoriteMeals];
        updatedFavMeals.splice(existingIndex, 1);
        return { ...state, favoriteMeals: updatedFavMeals };
      } else {
        const meal = state.meals.find((meal) => meal.id === action.mealId);
        return { ...state, favoriteMeals: state.favoriteMeals.concat(meal) };
      }
    }
    case CREATE_MEAL: {
      return {
        ...state,
        meals: [action.meal].concat(state.meals),
      };
    }
    case EDIT_MEAL: {
      const mealIndex = state.meals.findIndex((m) => m.id === action.meal.id);
      const updatedMeals = [...state.meals];
      updatedMeals[mealIndex] = action.meal;

      return {
        ...state,
        meals: updatedMeals,
      };
    }

    default:
      return state;
  }
};

export default mealsReducer;
