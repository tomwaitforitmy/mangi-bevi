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
      case SET_MEALS_COOKED_BY_USER: {
        let temp = {};
        const arrayWithDuplicates = [
          ...state.mealsCookedByUser,
          ...action.mealCookedByUser,
        ];

        //todo: extract method
        let arrayWithoutDuplicates = arrayWithDuplicates.reduce((acc, cur) => {
          if (!temp[cur.id]) {
            temp[cur.id] = true;
            acc.push(cur);
          }
          return acc;
        }, []);

        const newMealsCookedByUser = arrayWithoutDuplicates;

        console.log(newMealsCookedByUser);
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
