import { GetUserMeals } from "../../common_functions/GetUserMeals";
import { GetUserStats } from "../../common_functions/GetUserStats";
import {
  SET_USERS,
  CREATE_USER,
  EDIT_USER,
  EDIT_FRIENDS,
  UPDATE_USER_STATS,
  ERROR_NO_USER_LOGGED_IN,
  EDIT_EXPO_PUSH_TOKEN,
  EDIT_SETTINGS,
} from "../actions/usersAction";

const initialState = {
  users: [],
  user: null,
  userStats: null,
  userMealsData: null,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS: {
      //We don't have userStats here, yet, because we don't have
      //fetched meals, yet.
      return {
        ...state,
        users: action.users,
        user: action.user,
      };
    }
    case CREATE_USER: {
      return {
        ...state,
        users: [action.user].concat(state.users),
        user: action.user,
      };
    }
    case EDIT_EXPO_PUSH_TOKEN:
    case EDIT_SETTINGS:
    case EDIT_FRIENDS: {
      //create a new user object, to make sure state is updated
      const editedUser = { ...action.user };
      const userId = state.users.findIndex((u) => u.id === action.user.id);
      const updatedUsers = [...state.users];
      updatedUsers[userId] = editedUser;

      return {
        ...state,
        users: updatedUsers,
        user: editedUser,
      };
    }
    case EDIT_USER: {
      //create a new user object, to make sure state is updated
      const editedUser = { ...action.user };
      const userId = state.users.findIndex((u) => u.id === action.user.id);
      const updatedUsers = [...state.users];
      updatedUsers[userId] = editedUser;

      const userMeals = GetUserMeals(action.meals, action.user.meals);
      const updatedUserStats = GetUserStats(userMeals, action.user.id);

      return {
        ...state,
        users: updatedUsers,
        user: editedUser,
        userStats: updatedUserStats,
        userMealsData: userMeals,
      };
    }
    case UPDATE_USER_STATS: {
      if (!state.user || state.user === ERROR_NO_USER_LOGGED_IN) {
        console.log("No user logged in. Cannot generate stats.");
        return state;
      }

      const userMeals = GetUserMeals(action.meals, state.user.meals);
      const updatedUserStats = GetUserStats(userMeals, state.user.id);

      return {
        ...state,
        userStats: updatedUserStats,
        userMealsData: userMeals,
      };
    }

    default:
      return state;
  }
};

export default usersReducer;
