import { MEALS } from "../../data/DummyMeals";
import {
  SET_FILTERS,
  TOGGLE_FAVORITE,
  SET_MEALS,
} from "../actions/mealsAction";

const initialState = {
  meals: MEALS,
  filteredMeals: MEALS,
  favoriteMeals: [],
};

const mealsReducer = (state = initialState, action) => {
  console.log("mealsReducer" + action.type.toString());
  switch (action.type) {
    case TOGGLE_FAVORITE: {
      const existingIndex = state.favoriteMeals.findIndex(
        (meal) => meal.id === action.mealId
      );
      if (existingIndex >= 0) {
        const udpatedFavMeals = [...state.favoriteMeals];
        udpatedFavMeals.splice(existingIndex, 1);
        return { ...state, favoriteMeals: udpatedFavMeals };
      } else {
        const meal = state.meals.find((meal) => meal.id === action.mealId);
        return { ...state, favoriteMeals: state.favoriteMeals.concat(meal) };
      }
    }
    case SET_FILTERS: {
      const appliedFilters = action.filters;
      const filteredMeals = state.meals;
      //   if (appliedFilters.glutenFree && !meal.isGlutenFree) {
      //     return false;
      //   }
      //   if (appliedFilters.lactoseFree && !meal.isLactoseFree) {
      //     return false;
      //   }
      //   if (appliedFilters.vegan && !meal.isVegan) {
      //     return false;
      //   }
      //   if (appliedFilters.vegetarian && !meal.isVegetarian) {
      //     return false;
      //   }
      //   return true;
      // });

      return { ...state, filteredMeals: filteredMeals };
    }
    case SET_MEALS: {
      const newMeals = action.meals;
      return { ...state, meals: newMeals };
    }
    default:
      return state;
  }
};

export default mealsReducer;
