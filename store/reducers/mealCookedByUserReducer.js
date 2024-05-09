import {
  SET_MEALS_COOKED_BY_USER,
  ADD_MEAL_COOKED_BY_USER,
} from "../actions/mealCookedByUserAction";

const initialState = {
  mealsCookedByUser: [],
};

const mealCookedByUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MEAL_COOKED_BY_USER:
    case SET_MEALS_COOKED_BY_USER:
      return {
        ...state,
        mealsCookedByUser: [
          ...new Set(...state.mealsCookedByUser, action.mealCookedByUser),
        ],
      };
    default:
      return state;
  }
};

export default mealCookedByUserReducer;
